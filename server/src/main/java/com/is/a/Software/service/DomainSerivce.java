package com.is.a.Software.service;

import java.util.List;

import com.is.a.Software.dto.CreateDomainDto;
import com.is.a.Software.dto.DomainDto;

public interface DomainSerivce {
	 
	
	List<DomainDto> getUserDomains(String email);
	DomainDto createDomain(CreateDomainDto createDomain,String email);
	void deleteDomain(String email,int domainId);
     boolean checkAvailability(String subdomain);

}
