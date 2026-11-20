package com.is.a.Software.service.Impl;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.is.a.Software.dto.CreateDomainDto;
import com.is.a.Software.dto.DomainDto;
import com.is.a.Software.entity.DnsRecords;
import com.is.a.Software.entity.Domain;
import com.is.a.Software.entity.User;
import com.is.a.Software.exception.DomainNotFound;
import com.is.a.Software.exception.InvalidRecordValueException;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.DomainRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.CloudflareService;
import com.is.a.Software.service.DomainSerivce;

@Service
public class DomainServiceImpl implements DomainSerivce {

	/** One DNS label of 3-63 lowercase letters, digits and inner hyphens (the rule the Terms page states). */
	private static final Pattern SUBDOMAIN = Pattern.compile("^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$");

	/** Names kept for the service itself or easily used to impersonate it. */
	private static final Set<String> RESERVED = Set.of(
			"www", "api", "app", "admin", "root", "auth", "login", "signin", "signup", "account", "dashboard",
			"mail", "email", "smtp", "imap", "pop", "mx", "ns", "ns1", "ns2", "dns", "ftp", "status", "docs",
			"help", "support", "security", "abuse", "autodiscover", "autoconfig");

	private final DomainRepository domainRepo;
	private final ModelMapper modelmapper;
	private final UserRepository userRepo;
	private final CloudflareService cloudflareService;

	public DomainServiceImpl(DomainRepository domainRepo, ModelMapper modelmapper, UserRepository userRepo,
			CloudflareService cloudflareService) {
		this.domainRepo = domainRepo;
		this.modelmapper = modelmapper;
		this.userRepo = userRepo;
		this.cloudflareService = cloudflareService;
	}

	@Override
	public List<DomainDto> getUserDomains(String email) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("user not found exception"));
		return domainRepo.findByUser(user).stream().map(d -> modelmapper.map(d, DomainDto.class)).toList();
	}

	@Override
	public DomainDto createDomain(CreateDomainDto createDomain, String email) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
		String subdomain = normalize(createDomain.getSubdomain());

		if (!checkAvailability(subdomain)) {
			throw new RuntimeException("Subdomain is already taken");
		}

		Domain domain = new Domain();
		domain.setSubdomain(subdomain);
		domain.setUser(user);
		return modelmapper.map(domainRepo.save(domain), DomainDto.class);
	}

	@Override
	@Transactional
	public void deleteDomain(String email, int domainId) {
		Domain domain = domainRepo.findById(domainId).orElseThrow(() -> new DomainNotFound("Domain not exist"));

		if (!domain.getUser().getEmail().equals(email)) {
			throw new UserNotFoundException("User not Exist");
		}

		// Remove the live records first, so a freed name never keeps serving the old owner's DNS.
		for (DnsRecords record : domain.getDns()) {
			cloudflareService.deleteRecord(record.getCloudflareId());
		}
		domainRepo.delete(domain);
	}

	@Override
	public boolean checkAvailability(String subdomain) {
		String name = normalize(subdomain);
		return !domainRepo.existsBySubdomain(name) && !cloudflareService.hasRecordsFor(name);
	}

	private static String normalize(String subdomain) {
		String name = subdomain == null ? "" : subdomain.trim().toLowerCase(Locale.ROOT);
		if (!SUBDOMAIN.matcher(name).matches()) {
			throw new InvalidRecordValueException(
					"Subdomain must be 3-63 lowercase letters, digits or hyphens, and cannot start or end with a hyphen.");
		}
		if (RESERVED.contains(name)) {
			throw new InvalidRecordValueException("\"" + name + "\" is reserved. Please pick another name.");
		}
		return name;
	}
}
