package com.is.a.Software.security;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * One-time codes that hand a finished Central Auth sign-in from the backend to the frontend.
 * The browser gets only the code; the frontend trades it for the app token over a POST, so the
 * token never appears in a URL. Codes are single-use and expire after a minute.
 *
 * Kept in memory, so the backend must run as a single instance (as it does today).
 */
@Component
public class LoginCodeStore {

	private static final Duration TTL = Duration.ofSeconds(60);

	private record Pending(String email, Instant expiresAt) {
	}

	private final SecureRandom random = new SecureRandom();
	private final Map<String, Pending> codes = new ConcurrentHashMap<>();

	public String issue(String email) {
		Instant now = Instant.now();
		codes.values().removeIf(p -> p.expiresAt().isBefore(now));

		byte[] bytes = new byte[32];
		random.nextBytes(bytes);
		String code = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
		codes.put(code, new Pending(email, now.plus(TTL)));
		return code;
	}

	/** Returns the signed-in email and invalidates the code, or empty if unknown or expired. */
	public Optional<String> consume(String code) {
		if (code == null) {
			return Optional.empty();
		}
		Pending pending = codes.remove(code);
		if (pending == null || pending.expiresAt().isBefore(Instant.now())) {
			return Optional.empty();
		}
		return Optional.of(pending.email());
	}
}
