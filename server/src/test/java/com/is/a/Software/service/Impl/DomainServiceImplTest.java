package com.is.a.Software.service.Impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;

import com.is.a.Software.exception.InvalidRecordValueException;
import com.is.a.Software.repository.DomainRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.CloudflareService;

class DomainServiceImplTest {

	private DomainRepository domains;
	private CloudflareService cloudflare;
	private DomainServiceImpl service;

	@BeforeEach
	void setUp() {
		domains = mock(DomainRepository.class);
		cloudflare = mock(CloudflareService.class);
		service = new DomainServiceImpl(domains, new ModelMapper(), mock(UserRepository.class), cloudflare);
	}

	@Test
	void freeNameIsAvailableAndNormalized() {
		assertThat(service.checkAvailability("  My-Project ")).isTrue();
	}

	@Test
	void nameWithLiveCloudflareRecordsIsTaken() {
		when(cloudflare.hasRecordsFor("legacy")).thenReturn(true);

		assertThat(service.checkAvailability("legacy")).isFalse();
	}

	@Test
	void namesOutsideTheTermsAreRejected() {
		for (String bad : new String[] { "ab", "-abc", "abc-", "a_b_c", "a.b.c", "x".repeat(64), "" }) {
			assertThatThrownBy(() -> service.checkAvailability(bad))
					.as(bad).isInstanceOf(InvalidRecordValueException.class);
		}
		assertThat(service.checkAvailability("abc")).isTrue();
		assertThat(service.checkAvailability("x".repeat(63))).isTrue();
	}

	@Test
	void reservedNamesAreRejected() {
		assertThatThrownBy(() -> service.checkAvailability("WWW"))
				.isInstanceOf(InvalidRecordValueException.class).hasMessageContaining("reserved");
		assertThatThrownBy(() -> service.checkAvailability("admin"))
				.isInstanceOf(InvalidRecordValueException.class);
	}
}
