package com.is.a.Software.service.Impl;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.is.a.Software.dto.LimitDto;
import com.is.a.Software.dto.UpdateUsernameDto;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.Role;
import com.is.a.Software.entity.Enum.UserStatus;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.DnsRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.DnsService;
import com.is.a.Software.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final DnsRepository dnsRepo;

	public UserServiceImpl(UserRepository userRepo, DnsRepository dnsRepo) {
		this.userRepo = userRepo;
		this.dnsRepo = dnsRepo;
	}

	@Override
	public LimitDto getLimits(String email) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
		return new LimitDto(dnsRepo.countByDomainUser(user), DnsService.RECORD_LIMIT_PER_USER);
	}

	@Override
	public UpdateUsernameDto updateUsername(String email, String name) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("user not found"));
		user.setName(name);
		User updated = userRepo.save(user);
		return new UpdateUsernameDto(updated.getName(), updated.getEmail());
	}

	@Override
	@Transactional
	public User signInWithCentralAuth(String sub, String verifiedEmail, String name) {
		Optional<User> linked = userRepo.findByCentralAuthSub(sub);
		if (linked.isPresent()) {
			User user = linked.get();
			// Central Auth emails change only by an explicit account change; follow it if the address is free.
			if (!user.getEmail().equalsIgnoreCase(verifiedEmail)
					&& userRepo.findByEmailIgnoreCase(verifiedEmail).isEmpty()) {
				user.setEmail(verifiedEmail);
			}
			return user;
		}

		Optional<User> byEmail = userRepo.findByEmailIgnoreCase(verifiedEmail);
		if (byEmail.isPresent()) {
			User existing = byEmail.get();
			if (existing.getCentralAuthSub() != null && !Objects.equals(existing.getCentralAuthSub(), sub)) {
				throw new IllegalStateException("email is already linked to another Central Auth account");
			}
			// First Central Auth sign-in of a migrated email/password account: link it so it keeps its domains.
			existing.setCentralAuthSub(sub);
			return existing;
		}

		User user = new User();
		user.setCentralAuthSub(sub);
		user.setEmail(verifiedEmail);
		user.setName(name);
		user.setRole(Role.USER);
		user.setStatus(UserStatus.ACTIVE);
		return userRepo.save(user);
	}
}
