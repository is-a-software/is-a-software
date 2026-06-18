package com.is.a.Software.service;

import com.is.a.Software.dto.UserDto;

public interface AuthService {
public void forgotPassword(String email);
public void resetPassword(String token,String newPassword);
public UserDto registerUser(UserDto userdto);
public void changePassword(String email,String oldPassword,String newPassword);
public int returnOtp();

}
