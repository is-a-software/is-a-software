package com.is.a.Software.service.Impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.Role;
import com.is.a.Software.entity.Enum.UserStatus;
import com.is.a.Software.repository.DnsRepository;
import com.is.a.Software.repository.UserRepository;

class UserServiceImplTest {

	private UserRepository users;
	private UserServiceImpl service;

	@BeforeEach
	void setUp() {
		users = mock(UserRepository.class);
		service = new UserServiceImpl(users, mock(DnsRepository.class));
		when(users.findByCentralAuthSub(any())).thenReturn(Optional.empty());
		when(users.findByEmailIgnoreCase(any())).thenReturn(Optional.empty());
		when(users.save(any())).thenAnswer(call -> call.getArgument(0));
	}

	private static User user(String email, String sub) {
		User user = new User();
		user.setEmail(email);
		user.setCentralAuthSub(sub);
		return user;
	}

	@Test
	void migratedPasswordAccountIsLinkedByEmailAndKeepsItsRow() {
		User legacy = user("Alice@Example.com", null);
		when(users.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(legacy));

		User signedIn = service.signInWithCentralAuth("sub-alice", "alice@example.com", "Alice");

		assertThat(signedIn).isSameAs(legacy);
		assertThat(legacy.getCentralAuthSub()).isEqualTo("sub-alice");
		verify(users, never()).save(any());
	}

	@Test
	void linkedAccountIsFoundBySubEvenAfterEmailChange() {
		User linked = user("old@example.com", "sub-bob");
		when(users.findByCentralAuthSub("sub-bob")).thenReturn(Optional.of(linked));

		User signedIn = service.signInWithCentralAuth("sub-bob", "new@example.com", "Bob");

		assertThat(signedIn).isSameAs(linked);
		assertThat(linked.getEmail()).isEqualTo("new@example.com");
	}

	@Test
	void emailOwnedByAnotherIdentityIsRefused() {
		when(users.findByEmailIgnoreCase("carol@example.com"))
				.thenReturn(Optional.of(user("carol@example.com", "sub-someone-else")));

		assertThatThrownBy(() -> service.signInWithCentralAuth("sub-carol", "carol@example.com", "Carol"))
				.isInstanceOf(IllegalStateException.class);
	}

	@Test
	void unknownIdentityGetsANewActiveAccount() {
		User created = service.signInWithCentralAuth("sub-dave", "dave@example.com", "Dave");

		assertThat(created.getCentralAuthSub()).isEqualTo("sub-dave");
		assertThat(created.getEmail()).isEqualTo("dave@example.com");
		assertThat(created.getName()).isEqualTo("Dave");
		assertThat(created.getRole()).isEqualTo(Role.USER);
		assertThat(created.getStatus()).isEqualTo(UserStatus.ACTIVE);
		verify(users).save(created);
	}
}
