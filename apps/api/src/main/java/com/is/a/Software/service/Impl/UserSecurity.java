package com.is.a.Software.service.Impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.is.a.Software.entity.User;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.CustomerUserDetail;

@Service
public class UserSecurity implements UserDetailsService {

	private UserRepository userRepo;
	
	
	public UserSecurity(UserRepository userRepo) {
		super();
		this.userRepo = userRepo;
	}


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByEmail(username).orElseThrow(() -> new UserNotFoundException("user not found"));
		CustomerUserDetail customer = new CustomerUserDetail(user);
		return customer;
	}

}
