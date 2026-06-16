package com.is.a.Software.service.Impl;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.is.a.Software.dto.SocialDto;
import com.is.a.Software.entity.Social;
import com.is.a.Software.entity.User;

import com.is.a.Software.repository.SocialRepository;
import com.is.a.Software.service.SocialService;

@Service
public class SocialServiceImpl implements SocialService {

	private SocialRepository socialRepo;
	private ModelMapper modelmapper;



    public SocialServiceImpl(SocialRepository socialRepo, ModelMapper modelmapper) {
		super();
		this.socialRepo = socialRepo;
		this.modelmapper = modelmapper;
	}

	@Override
    public SocialDto saveGithubData(User user, String username, boolean starred) {

        Social social = socialRepo.findByUser(user)
                .orElse(new Social());

        social.setUser(user);
        social.setGithub(username);
        social.setGithubStar(starred);
        social.setLastCheck(LocalDate.now());
        
        
        if (starred && !social.isBonusClaimed()) {
            social.setBonusClaimed(true);
        }

        Social save = socialRepo.save(social);

        SocialDto socialdto = modelmapper.map(save, SocialDto.class);
        
        return socialdto;
        
    }

    @Override
    public SocialDto getSocial(User user) {
    	Social social = socialRepo.findByUser(user).orElseThrow(() -> new RuntimeException("social not found"));
    	SocialDto dto = modelmapper.map(social, SocialDto.class);
    	
    	return dto;
    	    }

	

}
