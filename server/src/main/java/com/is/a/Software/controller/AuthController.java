package com.is.a.Software.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.UserResponseDto;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.security.JwtService;
import com.is.a.Software.security.LoginCodeStore;

/**
 * Sign-in itself is the Central Auth redirect flow (see SecurityConfig). This endpoint finishes it:
 * the frontend trades the one-time code from the callback for this app's bearer token.
 */
@RestController
@RequestMapping("v1/api/auth")
public class AuthController {

	private final LoginCodeStore loginCodes;
	private final JwtService jwtService;
	private final UserRepository userRepo;

	public AuthController(LoginCodeStore loginCodes, JwtService jwtService, UserRepository userRepo) {
		this.loginCodes = loginCodes;
		this.jwtService = jwtService;
		this.userRepo = userRepo;
	}

	@PostMapping("/exchange")
	public ResponseEntity<?> exchange(@RequestBody Map<String, String> body) {
		return loginCodes.consume(body.get("code"))
				.flatMap(userRepo::findByEmail)
				.<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of(
						"token", jwtService.generateToken(user.getEmail()),
						"user", new UserResponseDto(user.getEmail(), user.getName()))))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
						"message", "Sign-in link expired. Please sign in again.",
						"status", HttpStatus.UNAUTHORIZED.value())));
	}
}
