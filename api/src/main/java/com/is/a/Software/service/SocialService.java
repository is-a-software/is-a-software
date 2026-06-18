package com.is.a.Software.service;

import org.springframework.stereotype.Service;

import com.is.a.Software.dto.SocialDto;
import com.is.a.Software.entity.User;

@Service
public interface SocialService {


    SocialDto saveGithubData(User user, String username, boolean starred);

    SocialDto getSocial(User user);
}
