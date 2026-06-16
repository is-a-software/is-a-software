package com.is.a.Software.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.DnsRecordsDto;
import com.is.a.Software.service.DnsService;

@RestController
@RequestMapping("v1/api")
public class DnsRecordsController {

	private DnsService dnsService;

	public DnsRecordsController(DnsService dnsService) {
		super();
		this.dnsService = dnsService;
	}

	@PostMapping("/domains/{domainId}/records")
	public ResponseEntity<DnsRecordsDto> createRecord(@PathVariable int domainId,
			@RequestBody DnsRecordsDto dnsRecordsDto, Authentication authentication) {
		String email = authentication.getName();
		DnsRecordsDto record = dnsService.createRecord(domainId, dnsRecordsDto, email);
		return ResponseEntity.ok(record);
	}

	@GetMapping("/domains/{domainId}/records")
	public ResponseEntity<List<DnsRecordsDto>> getRecords(@PathVariable int domainId, Authentication authentication) {

		String email = authentication.getName();

		List<DnsRecordsDto> records = dnsService.getRecords(domainId, email);

		return ResponseEntity.ok(records);
	}

	@PutMapping("/records/{recordId}")
	public ResponseEntity<DnsRecordsDto> updateRecord(@PathVariable int recordId, @RequestBody DnsRecordsDto dto,
			Authentication authentication) {

		String email = authentication.getName();

		DnsRecordsDto updated = dnsService.updateRecord(recordId, dto, email);

		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/records/{recordId}")
	public ResponseEntity<?> deleteRecord(@PathVariable int recordId, Authentication authentication) {

		String email = authentication.getName();

		dnsService.deleteRecord(recordId, email);

		return ResponseEntity.ok("Record deleted");
	}
}
