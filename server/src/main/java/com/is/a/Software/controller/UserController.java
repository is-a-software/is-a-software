package com.is.a.Software.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.UpdateUsernameDto;
import com.is.a.Software.dto.UserResponseDto;
import com.is.a.Software.entity.User;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.UserService;

@RestController
@RequestMapping("/v1/api/user")
public class UserController {

	private final UserRepository userRepo;
	private final UserService userService;

	public UserController(UserRepository userRepo, UserService userService) {
		this.userRepo = userRepo;
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponseDto> getMe(Authentication authentication) {
		User user = userRepo.findByEmail(authentication.getName())
				.orElseThrow(() -> new UserNotFoundException("User Not Exist"));
		return ResponseEntity.ok(new UserResponseDto(user.getEmail(), user.getName()));
	}

	@GetMapping("/limits")
	public ResponseEntity<?> getLimits(Authentication authentication) {
		return ResponseEntity.ok(userService.getLimits(authentication.getName()));
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updateUsername(Authentication authentication, @RequestBody Map<String, String> request) {
		UpdateUsernameDto updated = userService.updateUsername(authentication.getName(), request.get("name"));
		return ResponseEntity.ok(Map.of("message", "Update Successfully", "data", updated));
	}
}
