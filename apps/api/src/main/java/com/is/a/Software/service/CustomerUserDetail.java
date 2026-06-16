package com.is.a.Software.service;

import java.util.Collection;
import java.util.Collections;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.is.a.Software.entity.User;

public class CustomerUserDetail implements UserDetails {

	private User user;

	public CustomerUserDetail(User user) {
		super();
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		String role = "ROLE_" + user.getRole().toString();

		SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

		return Collections.singleton(authority);
	}

	@Override
	public @Nullable String getPassword() {
		return user.getPassword();

	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return user.getEmail();
	}

}
