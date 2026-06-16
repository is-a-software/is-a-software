package com.is.a.Software.controller;

import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.ChangeEmailSettings;
import com.is.a.Software.dto.ChangePasswordDto;
import com.is.a.Software.dto.ForgatPasswordRequest;
import com.is.a.Software.dto.LoginRequest;
import com.is.a.Software.dto.ResetPasswordRequest;
import com.is.a.Software.dto.TempUserDto;
import com.is.a.Software.dto.UserDto;
import com.is.a.Software.dto.jwtResponse;
import com.is.a.Software.entity.util.Mail;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.security.JwtService;
import com.is.a.Software.service.AuthService;
import com.is.a.Software.service.OtpService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/api/auth")
public class AuthController {

	private JwtService jwtservice;
	private UserDetailsService userDetailService;
	private AuthenticationManager authManager;
	private UserRepository userRepo;
	private ModelMapper modelmapper;
	private AuthService authservice;
	private OtpService otpservice;
	private Mail mail;



	public AuthController(JwtService jwtservice, UserDetailsService userDetailService,
			AuthenticationManager authManager, UserRepository userRepo, ModelMapper modelmapper,
			AuthService authservice, OtpService otpservice, Mail mail) {
		super();
		this.jwtservice = jwtservice;
		this.userDetailService = userDetailService;
		this.authManager = authManager;
		this.userRepo = userRepo;
		this.modelmapper = modelmapper;
		this.authservice = authservice;
		this.otpservice = otpservice;
		this.mail = mail;
	}

	@PostMapping("/register/request-otp")
	public ResponseEntity<?> create(@Valid @RequestBody UserDto userdto) {
		int otp = authservice.returnOtp();
		otpservice.saveTempUser(userdto.getEmail(), userdto, otp);
		mail.sendMail(userdto.getEmail(), otp);
		return ResponseEntity.ok("Otp Send");

	}


	@PostMapping("/register/verify-otp")
	public ResponseEntity<?> verifyUser(@RequestBody Map<String, String> req) {
	    int otp = Integer.parseInt(req.get("otp"));
	    String email = req.get("email");

	    Long savedTime = otpservice.getTempTimestamp(email);
	    if (savedTime != null && System.currentTimeMillis() - savedTime > 60000) {
	        otpservice.removeTempUser(email);
	        return ResponseEntity.badRequest().body(Map.of("message", "OTP expired. Please request a new one."));
	    }

	    TempUserDto tempUser = otpservice.getTempUser(email);
	    if (tempUser == null || tempUser.getOtp() != otp) {
	        return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP. Please check and try again."));
	    }

	    UserDto registerUser = authservice.registerUser(tempUser.getUserdto());
	    otpservice.removeTempUser(email);
	    return ResponseEntity.status(HttpStatus.CREATED).body(registerUser);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

		UsernamePasswordAuthenticationToken authenticate = new UsernamePasswordAuthenticationToken(
				loginRequest.getEmail(), loginRequest.getPassword());

		authManager.authenticate(authenticate);

		UserDetails userdetails = userDetailService.loadUserByUsername(loginRequest.getEmail());

		String token = jwtservice.generateToken(loginRequest.getEmail());

		UserDto userdto = modelmapper.map(userRepo.findByEmail(userdetails.getUsername()), UserDto.class);

		jwtResponse response = jwtResponse.builder().accessToken(token).userDto(userdto).build();

		return ResponseEntity.ok(response);

	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestBody ForgatPasswordRequest forgatPassword) {
		authservice.forgotPassword(forgatPassword.getEmail());
         return ResponseEntity.ok(Map.of("message","Reset Link sent"));
 
	}

	@PostMapping("/reset-password")
	public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

	    authservice.resetPassword(request.getToken(), request.getNewPassword());

	    return ResponseEntity.ok(Map.of("message", "Password updated"));
	}
	
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto cpdto,Authentication auth){
		String name = auth.getName();
		authservice.changePassword(name, cpdto.getCurrentPassword(),cpdto.getNewPassword());
		return ResponseEntity.ok("done");
		
	}
	
	
	

}
