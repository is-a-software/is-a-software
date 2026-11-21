package com.is.a.Software.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.is.a.Software.entity.User;
import com.is.a.Software.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Runs after Spring Security has validated the Central Auth ID token. Links or creates the
 * account, then sends the browser back to the frontend with a one-time login code.
 */
@Component
public class CentralAuthLoginHandler implements AuthenticationSuccessHandler, AuthenticationFailureHandler {

	private static final Logger log = LoggerFactory.getLogger(CentralAuthLoginHandler.class);

	private final UserService userService;
	private final LoginCodeStore loginCodes;
	private final String frontendUrl;

	public CentralAuthLoginHandler(UserService userService, LoginCodeStore loginCodes,
			@Value("${app.frontend.url}") String frontendUrl) {
		this.userService = userService;
		this.loginCodes = loginCodes;
		this.frontendUrl = frontendUrl.replaceAll("/+$", "");
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {
		endLoginSession(request);

		OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
		if (!Boolean.TRUE.equals(oidcUser.getEmailVerified()) || oidcUser.getEmail() == null) {
			redirectWithError(response, "email_not_verified");
			return;
		}

		User user;
		try {
			user = userService.signInWithCentralAuth(oidcUser.getSubject(), oidcUser.getEmail(), oidcUser.getFullName());
		} catch (IllegalStateException conflict) {
			log.warn("Central Auth sign-in refused for sub {}: {}", oidcUser.getSubject(), conflict.getMessage());
			redirectWithError(response, "account_conflict");
			return;
		}

		// Fragment, not query: it is never sent to any server or written to access logs.
		response.sendRedirect(frontendUrl + "/auth/callback#code=" + loginCodes.issue(user.getEmail()));
	}

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException {
		endLoginSession(request);
		log.warn("Central Auth sign-in failed: {}", exception.getMessage());
		redirectWithError(response, "sign_in_failed");
	}

	/** The HTTP session only carried the OIDC state/nonce/PKCE verifier for this one sign-in. */
	private static void endLoginSession(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
		}
	}

	private void redirectWithError(HttpServletResponse response, String error) throws IOException {
		response.sendRedirect(frontendUrl + "/?auth_error=" + error);
	}
}
