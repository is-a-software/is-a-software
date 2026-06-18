package com.is.a.Software.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.is.a.Software.entity.DnsRecords;
import com.is.a.Software.entity.Domain;
import com.is.a.Software.entity.User;

public interface DnsRepository extends JpaRepository<DnsRecords, Integer> {
	   int countByDomainUser(User user);
	   List<DnsRecords> findByDomain(Domain domain);
	   List<DnsRecords> findByDomainAndName(Domain domain, String name);
}
