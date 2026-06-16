package com.is.a.Software.service;

import org.springframework.stereotype.Service;

import com.is.a.Software.dto.LimitDto;
import com.is.a.Software.dto.UpdateUsernameDto;
import com.is.a.Software.dto.UserDto;
import com.is.a.Software.dto.UserResponseDto;

@Service
public interface UserService {
	 LimitDto getLimits(String email);
	 UpdateUsernameDto updateUsername(String email,String name);
	 void verifyPasswordAndSendOtp(String oldEmail, String email, String password);
	 UserResponseDto updateEmailVerifyOtp(String oldEmail, String newEmail, int otp);

	
}
