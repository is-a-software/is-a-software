package com.is.a.Software.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private JwtService jwtservice;
	private UserDetailsService userdetail;

	public JwtAuthenticationFilter(JwtService jwtservice, UserDetailsService userdetail) {
		super();
		this.jwtservice = jwtservice;
		this.userdetail = userdetail;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
	        HttpServletResponse response,
	        FilterChain filterChain)
	        throws ServletException, IOException {

	    String authorization = request.getHeader("Authorization");
	    String path = request.getServletPath();

	 if (path.startsWith("/v1/api/auth/login")) {
	     filterChain.doFilter(request, response);
	     return;
	 }
	    
	    if (authorization != null && authorization.startsWith("Bearer ")) {

	        String token = authorization.substring(7);

	        String username = null;

	        try {
	            username = jwtservice.getUsername(token);
	           
	        } catch (Exception e) {
	            System.out.println("JWT ERROR: " + e.getMessage());
	        }

	        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

	            UserDetails userdetails = userdetail.loadUserByUsername(username);

	            if (jwtservice.verifyToken(token)) {

	                UsernamePasswordAuthenticationToken authToken =
	                        new UsernamePasswordAuthenticationToken(
	                                userdetails,
	                                null,
	                                userdetails.getAuthorities()
	                        );

	                SecurityContextHolder.getContext().setAuthentication(authToken);
	            }
	        }
	    }
	    filterChain.doFilter(request, response);
	}
}
