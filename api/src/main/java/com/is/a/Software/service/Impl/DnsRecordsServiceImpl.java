package com.is.a.Software.service.Impl;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.is.a.Software.dto.DnsRecordsDto;
import com.is.a.Software.entity.DnsRecords;
import com.is.a.Software.entity.Domain;
import com.is.a.Software.entity.Social;
import com.is.a.Software.entity.Subscription;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.SubscriptionStatus;
import com.is.a.Software.entity.util.PlanLimit;
import com.is.a.Software.exception.DomainNotFound;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.DnsRepository;
import com.is.a.Software.repository.DomainRepository;
import com.is.a.Software.repository.SocialRepository;
import com.is.a.Software.repository.SubscriptionRepository;
import com.is.a.Software.exception.DnsLimitExceededException;
import com.is.a.Software.exception.InvalidRecordValueException;
import com.is.a.Software.exception.RecordConflictException;
import com.is.a.Software.exception.RecordNotFoundException;
import com.is.a.Software.exception.SubscriptionRequiredException;
import com.is.a.Software.service.CloudflareService;
import com.is.a.Software.service.DnsService;

import com.is.a.Software.entity.Enum.RecordType;

@Service
@Transactional(rollbackFor = Exception.class)
public class DnsRecordsServiceImpl implements DnsService {

    private DomainRepository domainRepo;
    private DnsRepository dnsRepo;
    private ModelMapper modelmapper;
    private SubscriptionRepository subRepo;
    private SocialRepository socialRepo;
    private CloudflareService cloudflareService;

    public DnsRecordsServiceImpl(DomainRepository domainRepo, DnsRepository dnsRepo, ModelMapper modelmapper,
                                 SubscriptionRepository subRepo, SocialRepository socialRepo,
                                 CloudflareService cloudflareService) {
        super();
        this.domainRepo = domainRepo;
        this.dnsRepo = dnsRepo;
        this.modelmapper = modelmapper;
        this.subRepo = subRepo;
        this.socialRepo = socialRepo;
        this.cloudflareService = cloudflareService;
    }

    private static final Pattern IPV4_PATTERN =
        Pattern.compile("^(\\d{1,3}\\.){3}\\d{1,3}$");

    private static final Pattern IPV6_PATTERN =
        Pattern.compile("^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$");

    private void validateRecordValue(String type, String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidRecordValueException("Record value is required.");
        }

        switch (type) {
            case "A" -> {
                if (!IPV4_PATTERN.matcher(value).matches()) {
                    throw new InvalidRecordValueException(
                        "Invalid A record value. Must be a valid IPv4 address (e.g., 192.168.1.1)."
                    );
                }
                for (String octet : value.split("\\.")) {
                    int num = Integer.parseInt(octet);
                    if (num < 0 || num > 255) {
                        throw new InvalidRecordValueException(
                            "Invalid A record value. Each octet must be between 0 and 255."
                        );
                    }
                }
            }
            case "AAAA" -> {
                if (!IPV6_PATTERN.matcher(value).matches()) {
                    throw new InvalidRecordValueException(
                        "Invalid AAAA record value. Must be a valid IPv6 address (e.g., 2001:db8::1)."
                    );
                }
            }
            case "CNAME" -> {
                if (IPV4_PATTERN.matcher(value).matches()) {
                    throw new InvalidRecordValueException(
                        "CNAME record cannot point to an IP address. Use an A record instead."
                    );
                }
                if (IPV6_PATTERN.matcher(value).matches()) {
                    throw new InvalidRecordValueException(
                        "CNAME record cannot point to an IP address. Use an AAAA record instead."
                    );
                }
                if (!value.contains(".")) {
                    throw new InvalidRecordValueException(
                        "CNAME record value must be a valid hostname (e.g., example.github.io)."
                    );
                }
            }
            case "MX" -> {
                if (IPV4_PATTERN.matcher(value).matches() || IPV6_PATTERN.matcher(value).matches()) {
                    throw new InvalidRecordValueException(
                        "MX record cannot point to an IP address. Use a hostname instead."
                    );
                }
            }
        }
    }

    @Override
    public DnsRecordsDto createRecord(int domainId, DnsRecordsDto dto, String email) {

        Domain domain = domainRepo.findById(domainId)
                .orElseThrow(() -> new DomainNotFound("Domain not found"));

        if (!domain.getUser().getEmail().equals(email)) {
            throw new UserNotFoundException("Unauthorized");
        }

        validateRecordValue(dto.getType().name(), dto.getValue());

        User user = domain.getUser();

        Subscription sub = subRepo
                .findTopByUserAndStatusOrderByIdDesc(user, SubscriptionStatus.ACTIVE)
                .orElseThrow(SubscriptionRequiredException::new);

        int limit = PlanLimit.getDnsLimit(sub.getPlan());

        Optional<Social> socialOpt = socialRepo.findByUser(user);
        if (socialOpt.isPresent() && socialOpt.get().isBonusClaimed()) {
            limit += 3;
        }

        int count = dnsRepo.countByDomainUser(user);

        if (count >= limit) {
            throw new DnsLimitExceededException(limit);
        }

        RecordType type = dto.getType();
        if (type == RecordType.A || type == RecordType.AAAA || type == RecordType.CNAME) {
            String name = dto.getName() == null ? "@" : dto.getName();
            List<DnsRecords> existing = dnsRepo.findByDomainAndName(domain, name);
            for (DnsRecords rec : existing) {
                RecordType existingType = rec.getType();
                if (existingType == RecordType.A || existingType == RecordType.AAAA || existingType == RecordType.CNAME) {
                    throw new RecordConflictException(domain.getSubdomain(), name, type.name());
                }
            }
        }

        DnsRecords dns = modelmapper.map(dto, DnsRecords.class);
        dns.setDomain(domain);

        DnsRecords saved = dnsRepo.save(dns);

        String cfId = cloudflareService.createRecord(domain.getSubdomain(), saved);
        saved.setCloudflareId(cfId);
        dnsRepo.save(saved);

        return modelmapper.map(saved, DnsRecordsDto.class);
    }

    @Override
    public List<DnsRecordsDto> getRecords(int domainId, String email) {
        Domain domain = domainRepo.findById(domainId).orElseThrow(() -> new DomainNotFound("Domain not exist"));
        if (!domain.getUser().getEmail().equals(email)) {
            throw new UserNotFoundException("User Not Found");
        }
        List<DnsRecords> dnsRecord = dnsRepo.findByDomain(domain);

        List<DnsRecordsDto> dns = dnsRecord.stream().map(dom -> modelmapper.map(dom, DnsRecordsDto.class)).toList();

        return dns;
    }

    @Override
    public DnsRecordsDto updateRecord(int recordId, DnsRecordsDto dto, String email) {

        DnsRecords dnsRecords = dnsRepo.findById(recordId)
                .orElseThrow(() -> new RecordNotFoundException(recordId));

        if (!dnsRecords.getDomain().getUser().getEmail().equals(email)) {
            throw new UserNotFoundException("User Not Found");
        }

        validateRecordValue(dto.getType().name(), dto.getValue());

        dnsRecords.setType(dto.getType());
        dnsRecords.setName(dto.getName());
        dnsRecords.setValue(dto.getValue());
        dnsRecords.setTtl(dto.getTtl());

        cloudflareService.updateRecord(dnsRecords.getDomain().getSubdomain(), dnsRecords);

        DnsRecords saved = dnsRepo.save(dnsRecords);

        return modelmapper.map(saved, DnsRecordsDto.class);
    }

    @Override
    public void deleteRecord(int recordId, String email) {

        DnsRecords dnsRecord = dnsRepo.findById(recordId)
                .orElseThrow(() -> new RecordNotFoundException(recordId));

        if (!dnsRecord.getDomain().getUser().getEmail().equals(email)) {
            throw new UserNotFoundException("User Not Found");
        }

        cloudflareService.deleteRecord(dnsRecord.getCloudflareId());

        dnsRepo.delete(dnsRecord);
    }
}
