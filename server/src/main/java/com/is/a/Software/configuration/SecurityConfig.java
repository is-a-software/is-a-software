package com.is.a.Software.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.is.a.Software.security.CentralAuthLoginHandler;
import com.is.a.Software.security.JwtAuthenticationEntryPoint;
import com.is.a.Software.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

	/** Frontend sends the browser here to start a Central Auth sign-in: {@code .../central-auth}. */
	public static final String AUTHORIZATION_BASE_URI = "/v1/api/auth/oauth2/authorization";
	/** Central Auth redirects back here; register {@code <backend>/v1/api/auth/oauth2/callback/central-auth}. */
	public static final String CALLBACK_BASE_URI = "/v1/api/auth/oauth2/callback/*";

	private final JwtAuthenticationFilter jwtFilter;
	private final JwtAuthenticationEntryPoint entryPoint;
	private final CentralAuthLoginHandler loginHandler;

	public SecurityConfig(JwtAuthenticationFilter jwtFilter, JwtAuthenticationEntryPoint entryPoint,
			CentralAuthLoginHandler loginHandler) {
		this.jwtFilter = jwtFilter;
		this.entryPoint = entryPoint;
		this.loginHandler = loginHandler;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrations) {
		DefaultOAuth2AuthorizationRequestResolver authorizationRequests =
				new DefaultOAuth2AuthorizationRequestResolver(clientRegistrations, AUTHORIZATION_BASE_URI);
		authorizationRequests.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());

		http
			.cors(cors -> {})
			// API calls authenticate with a bearer header, never a cookie, so CSRF does not apply.
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/v1/api/auth/**", "/v1/api/domains/check").permitAll()
				.requestMatchers("/v1/api/**").authenticated()
				.anyRequest().permitAll())
			.oauth2Login(oauth -> oauth
				.authorizationEndpoint(endpoint -> endpoint.authorizationRequestResolver(authorizationRequests))
				.redirectionEndpoint(endpoint -> endpoint.baseUri(CALLBACK_BASE_URI))
				.successHandler(loginHandler)
				.failureHandler(loginHandler))
			// The OIDC handshake keeps its state in a short-lived session; nothing else does.
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.exceptionHandling(exception -> exception.authenticationEntryPoint(entryPoint))
			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource(@Value("${app.frontend.url}") String frontendUrl) {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of(frontendUrl.replaceAll("/+$", "")));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
