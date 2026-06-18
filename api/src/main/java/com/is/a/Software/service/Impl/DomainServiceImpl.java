package com.is.a.Software.service.Impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.is.a.Software.dto.CreateDomainDto;
import com.is.a.Software.dto.DomainDto;
import com.is.a.Software.entity.Domain;
import com.is.a.Software.entity.Subscription;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.SubscriptionStatus;
import com.is.a.Software.entity.util.PlanLimit;
import com.is.a.Software.exception.DomainNotFound;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.DomainRepository;
import com.is.a.Software.repository.SubscriptionRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.DomainSerivce;

@Service
public class DomainServiceImpl implements DomainSerivce {
	

	
	private DomainRepository domainRepo;
	private ModelMapper modelmapper;
	private UserRepository userRepo;
	private SubscriptionRepository subRepo;

	
	


	public DomainServiceImpl(DomainRepository domainRepo, ModelMapper modelmapper, UserRepository userRepo,
			SubscriptionRepository subRepo) {
		super();
		this.domainRepo = domainRepo;
		this.modelmapper = modelmapper;
		this.userRepo = userRepo;
		this.subRepo = subRepo;
	}


	@Override
	public List<DomainDto> getUserDomains(String email) {
		User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("user not found exception"));
		List<Domain>  domaindto = domainRepo.findByUser(user);
		List<DomainDto> domainDto = domaindto.stream().map(d -> modelmapper.map(d, DomainDto.class) ).toList();
		return domainDto;
	}

	@Override
	public DomainDto createDomain(CreateDomainDto createDomain, String email) {

	    User user = userRepo.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Subscription sub = subRepo
	            .findTopByUserAndStatusOrderByIdDesc(user, SubscriptionStatus.ACTIVE).orElse(null);

	    if (sub == null) {
	        throw new RuntimeException("No active subscription");
	    }

	    int limit = PlanLimit.getDomainLimit(sub.getPlan());

	    
	    int count = domainRepo.countByUser(user);

	    if (count >= limit) {
	        throw new RuntimeException("Domain limit exceeded, upgrade plan");
	    }

	    Domain domain = modelmapper.map(createDomain, Domain.class);
	    domain.setUser(user);

	    Domain saved = domainRepo.save(domain);

	    return modelmapper.map(saved, DomainDto.class);
	}


	@Override
	public void deleteDomain(String email, int domainId) {
		Domain domain = domainRepo.findById(domainId).orElseThrow(() -> new DomainNotFound("Domain not exist"));
		
		if(!domain.getUser().getEmail().equals(email)) {
			throw new UserNotFoundException("User not Exist");
		}
		
		domainRepo.delete(domain);
		
	}


	@Override
	public boolean checkAvailability(String subdomain) {
	return !domainRepo.existsBySubdomain(subdomain);
	}








}
