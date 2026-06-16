package com.is.a.Software.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.is.a.Software.entity.Domain;
import com.is.a.Software.entity.User;

public interface DomainRepository extends JpaRepository<Domain, Integer>{

	 List<Domain> findByUser(User user);
	 

	    boolean existsBySubdomain(String subdomain);

	 int countByUser(User user);


}
