package com.is.a.Software.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LoginCodeStoreTest {

	private final LoginCodeStore store = new LoginCodeStore();

	@Test
	void codeWorksExactlyOnce() {
		String code = store.issue("alice@example.com");

		assertThat(store.consume(code)).contains("alice@example.com");
		assertThat(store.consume(code)).isEmpty();
	}

	@Test
	void unknownOrMissingCodesAreRejected() {
		store.issue("alice@example.com");

		assertThat(store.consume("not-a-code")).isEmpty();
		assertThat(store.consume(null)).isEmpty();
	}

	@Test
	void codesAreUnguessableAndUrlSafe() {
		String code = store.issue("alice@example.com");

		assertThat(code).hasSizeGreaterThanOrEqualTo(43).matches("[A-Za-z0-9_-]+");
		assertThat(store.issue("alice@example.com")).isNotEqualTo(code);
	}
}
