package com.is.a.Software.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.CreateDomainDto;
import com.is.a.Software.dto.DomainCheckRequest;
import com.is.a.Software.dto.DomainDto;
import com.is.a.Software.service.DomainSerivce;

@RestController
@RequestMapping("v1/api/domains")
public class DomainController {

	private DomainSerivce domainService;
	
	
	
	public DomainController(DomainSerivce domainService) {
		super();
		this.domainService = domainService;
	}



	@GetMapping
	public ResponseEntity<List<DomainDto>> getDomain(Authentication authentication){
		
		String name = authentication.getName();
		List<DomainDto> userDomains = domainService.getUserDomains(name);
		return ResponseEntity.ok(userDomains);
	}
	
	@PostMapping
	public ResponseEntity<DomainDto> createDomain(@RequestBody CreateDomainDto cDomain,Authentication authentication){
		
		String email = authentication.getName();
		DomainDto Domain = domainService.createDomain(cDomain, email);
	     return ResponseEntity.ok(Domain);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteDomain(@PathVariable int id,Authentication authentication){
		String email = authentication.getName();
		domainService.deleteDomain(email, id);
		return ResponseEntity.ok("Deleted");
	}
	
	
	  @PostMapping("/check")
	    public ResponseEntity<?> checkAvailability(
	            @RequestBody DomainCheckRequest request) {

	        boolean available =
	                domainService.checkAvailability(
	                        request.getDomain()
	                );

	        return ResponseEntity.ok(
	                Map.of(
	                        "domain", request.getDomain(),
	                        "available", available
	                )
	        );
	    }
	
}
