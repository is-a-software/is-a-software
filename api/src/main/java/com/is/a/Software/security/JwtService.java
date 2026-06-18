package com.is.a.Software.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final long EXPIRATION_TIME = 60 * 60 * 1000;

	@Value("${jwt.secret}")
	private String secretKey;

	public String generateToken(String username) {

		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.claim("type", "LOGIN") 
				.signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256).compact();
	}

	
	
	public String getUsername(String token) {

		return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))).build()
				.parseClaimsJws(token).getBody().getSubject();
	}

	

	
	
	public boolean verifyToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))).build().parseClaimsJws(token);

			return true;

		} catch (Exception e) {
			return false;
		}
		
		
	}
	
	
	
//	---------------RESET PASSWORD TOKEN CODE-------------------------------
	  private static final long RESET_EXPIRATION = 5 * 60 * 1000;

	public String generateResetToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + RESET_EXPIRATION))
                .claim("type", "RESET") 
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }
	
	public String validateResetToken(String token) {

	    if (!verifyToken(token)) {
	        throw new RuntimeException("Invalid or expired token");
	    }

	    Claims claims = getClaims(token);

	    String type = claims.get("type", String.class);

	    if (!"RESET".equals(type)) {
	        throw new RuntimeException("Invalid reset token");
	    }

	    return claims.getSubject();
	}
	 
	    private Claims getClaims(String token) {
	        return Jwts.parserBuilder()
	                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	    }
	    
	   
}