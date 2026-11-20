package com.is.a.Software.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;

import com.is.a.Software.entity.User;
import com.is.a.Software.service.UserService;

class CentralAuthLoginHandlerTest {

	private UserService userService;
	private LoginCodeStore codes;
	private CentralAuthLoginHandler handler;
	private MockHttpServletRequest request;
	private MockHttpServletResponse response;

	@BeforeEach
	void setUp() {
		userService = mock(UserService.class);
		codes = new LoginCodeStore();
		handler = new CentralAuthLoginHandler(userService, codes, "https://is-a.software/");
		request = new MockHttpServletRequest();
		request.setSession(new MockHttpSession());
		response = new MockHttpServletResponse();
	}

	private static TestingAuthenticationToken signedIn(Map<String, Object> extraClaims) {
		var claims = new java.util.HashMap<String, Object>(Map.of(
				"sub", "sub-1", "email", "alice@example.com", "name", "Alice"));
		claims.putAll(extraClaims);
		var idToken = new OidcIdToken("token", Instant.now(), Instant.now().plusSeconds(60), claims);
		return new TestingAuthenticationToken(new DefaultOidcUser(List.of(), idToken), null);
	}

	@Test
	void successRedirectsWithAOneTimeCodeInTheFragment() throws Exception {
		User alice = new User();
		alice.setEmail("alice@example.com");
		when(userService.signInWithCentralAuth("sub-1", "alice@example.com", "Alice")).thenReturn(alice);

		handler.onAuthenticationSuccess(request, response, signedIn(Map.of("email_verified", true)));

		String location = response.getRedirectedUrl();
		assertThat(location).startsWith("https://is-a.software/auth/callback#code=");
		assertThat(codes.consume(location.substring(location.indexOf("#code=") + 6))).contains("alice@example.com");
		assertThat(request.getSession(false)).isNull(); // handshake session is discarded
	}

	@Test
	void unverifiedEmailIsRejectedBeforeAnyAccountIsTouched() throws Exception {
		handler.onAuthenticationSuccess(request, response, signedIn(Map.of("email_verified", false)));

		assertThat(response.getRedirectedUrl()).isEqualTo("https://is-a.software/?auth_error=email_not_verified");
		verify(userService, never()).signInWithCentralAuth(any(), any(), any());
	}

	@Test
	void accountConflictIsReportedToTheUser() throws Exception {
		when(userService.signInWithCentralAuth(any(), any(), any())).thenThrow(new IllegalStateException("taken"));

		handler.onAuthenticationSuccess(request, response, signedIn(Map.of("email_verified", true)));

		assertThat(response.getRedirectedUrl()).isEqualTo("https://is-a.software/?auth_error=account_conflict");
	}

	@Test
	void failedSignInGoesBackToTheSignInPage() throws Exception {
		handler.onAuthenticationFailure(request, response, new OAuth2AuthenticationException(new OAuth2Error("invalid_state")));

		assertThat(response.getRedirectedUrl()).isEqualTo("https://is-a.software/?auth_error=sign_in_failed");
	}
}
