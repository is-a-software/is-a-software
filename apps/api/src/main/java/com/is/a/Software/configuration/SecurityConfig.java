	package com.is.a.Software.configuration;
	
	import java.util.List;

import org.springframework.context.annotation.Bean;
	import org.springframework.context.annotation.Configuration;
	import org.springframework.security.authentication.AuthenticationManager;
	import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
	import org.springframework.security.config.annotation.web.builders.HttpSecurity;
	import org.springframework.security.config.http.SessionCreationPolicy;
	import org.springframework.security.core.userdetails.User;
	import org.springframework.security.core.userdetails.UserDetails;
	import org.springframework.security.core.userdetails.UserDetailsService;
	import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
	import org.springframework.security.crypto.password.PasswordEncoder;
	import org.springframework.security.provisioning.InMemoryUserDetailsManager;
	import org.springframework.security.web.SecurityFilterChain;
	import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.is.a.Software.security.JwtAuthenticationEntryPoint;
	import com.is.a.Software.security.JwtAuthenticationFilter;
	
	@Configuration
	public class SecurityConfig {
	
		private JwtAuthenticationFilter filter;
		private JwtAuthenticationEntryPoint entrypoint;
	
		public SecurityConfig(JwtAuthenticationFilter filter, JwtAuthenticationEntryPoint entrypoint) {
			super();
			this.filter = filter;
			this.entrypoint = entrypoint;
		}
	
		@Bean
		public SecurityFilterChain fiterChain(HttpSecurity httpSecurity) {
	
			httpSecurity
			.cors(crs-> {})
		    .csrf(csrf -> csrf.disable())
		    .authorizeHttpRequests(auth -> auth
		    		
		        .requestMatchers(
		            "/v1/api/auth/**"
		        
		        ).permitAll()
		        .anyRequest().permitAll()
		    );
			
			httpSecurity.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
			httpSecurity.exceptionHandling(exception -> exception.authenticationEntryPoint(entrypoint));
			httpSecurity.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
			return httpSecurity.build();
		}
		
	
		@Bean
		public AuthenticationManager authManager(AuthenticationConfiguration config) {
			return config.getAuthenticationManager();
		}
	
		@Bean
		public PasswordEncoder password() {
			return new BCryptPasswordEncoder();
		}
		
		 @Bean
		    public CorsConfigurationSource corsConfigurationSource() {
		        CorsConfiguration config = new CorsConfiguration();

		        config.setAllowedOrigins(List.of("http://localhost:3000"));
		        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		        config.setAllowedHeaders(List.of("*"));
		        config.setAllowCredentials(true);
		        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		        source.registerCorsConfiguration("/**", config);
		        return source;
		    }
		
	
	}
