package com.is.a.Software.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.is.a.Software.*;
import com.is.a.Software.dto.ChangeEmailSettings;
import com.is.a.Software.dto.LimitDto;
import com.is.a.Software.dto.SubscriptionDto;
import com.is.a.Software.dto.UpdateUsernameDto;
import com.is.a.Software.dto.UserDto;
import com.is.a.Software.dto.UserDto.UserDtoBuilder;
import com.is.a.Software.dto.UserResponseDto;
import com.is.a.Software.entity.User;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.SubscriptionRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.OtpService;
import com.is.a.Software.service.SubscriptionService;
import com.is.a.Software.service.UserService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/v1/api/user")
public class UserController {

    
	private UserRepository userRepo;
	private SubscriptionService subService;
	private UserService userservice;
	
	public UserController(UserRepository userRepo, SubscriptionService subService, UserService userservice) {
		super();
		this.userRepo = userRepo;
		this.subService = subService;
		this.userservice = userservice;
	}


	@GetMapping("/me")
	public ResponseEntity<?> getme(Authentication authentication){
		if (authentication == null) {
	        return ResponseEntity.status(401).body("Unauthorized");
	    }
	  String email = authentication.getName();
	  User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User Not Exist"));
	 UserDto userDto = UserDto.builder().email(user.getEmail()).name(user.getName()).build();
	  return ResponseEntity.ok(userDto);
	  
	}
	
	
	@GetMapping("/subscription")
	public ResponseEntity<?> getSubscription(Authentication authentication){
		if (authentication == null) {
	        return ResponseEntity.status(401).body("Unauthorized");
	    }
		String name = authentication.getName();
		SubscriptionDto subscriptionDto = subService.getUserSubscription(name);
		return ResponseEntity.ok(subscriptionDto);
	}
	
	@GetMapping("/limits")
	public ResponseEntity<?> getLimits(Authentication auth) {
		if (auth == null) {
	        return ResponseEntity.status(401).body("Unauthorized");
	    }
	    String email = auth.getName();

	    return ResponseEntity.ok(userservice.getLimits(email));
	}
	
	
	@PutMapping("/profile")
	public ResponseEntity<?> updateUsername(
	        Authentication authentication,
	        @RequestBody Map<String, String> request) {

	    String email = authentication.getName();

	    String name = request.get("name"); 

	    UpdateUsernameDto usernameUpdate = userservice.updateUsername(email, name);
	    Map<String, Object> response = Map.of(
	            "message", "Update Successfully",
	            "data", usernameUpdate
	    );
	    
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping("/email/request-otp")
	public ResponseEntity<?> sendOtp(Authentication authentication,@RequestBody ChangeEmailSettings changeEmail){
	    String newemail = changeEmail.getNewEmail();
	    String password = changeEmail.getCurrentPassword();
	    String oldEmail = authentication.getName();
	    
	    userservice.verifyPasswordAndSendOtp(oldEmail,newemail,password);
	    
	    return ResponseEntity.ok("Otp Send in your email");
	}
	
	
	@PostMapping("/email/verify-otp")
	public ResponseEntity<?> verifyOtp(Authentication authentication,@RequestBody Map<String, String> body){
		               String oldEmail = authentication.getName();
		               String newEmail = body.get("newEmail");
		               int otp=Integer.parseInt(body.get("otp"));
		               
		               UserResponseDto userDto = userservice.updateEmailVerifyOtp(oldEmail,newEmail,otp);

		               return ResponseEntity.ok(
		                       Map.of(
		                           "message", "Email updated successfully",
		                           "data", userDto
		                       )
		               );
	}
	
	
}
