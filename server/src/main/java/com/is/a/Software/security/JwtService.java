package com.is.a.Software.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/** Issues and checks this app's own session token, handed out after a Central Auth sign-in. */
@Service
public class JwtService {

	private static final long EXPIRATION_TIME = 60 * 60 * 1000;
	private static final String TOKEN_TYPE = "LOGIN";

	@Value("${jwt.secret}")
	private String secretKey;

	private Key key() {
		return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.claim("type", TOKEN_TYPE)
				.signWith(key(), SignatureAlgorithm.HS256).compact();
	}

	public String getUsername(String token) {
		return claims(token).getSubject();
	}

	public boolean verifyToken(String token) {
		try {
			return TOKEN_TYPE.equals(claims(token).get("type", String.class));
		} catch (Exception e) {
			return false;
		}
	}

	private Claims claims(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
	}
}
