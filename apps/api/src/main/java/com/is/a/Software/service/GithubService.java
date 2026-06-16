package com.is.a.Software.service;

import com.is.a.Software.entity.User;

public interface GithubService {
    String getGithubRedirectUrl(String redirectUri, String state);
    String handleCallback(String code, String mode, String redirectUri, User user, String token);
    boolean verifyStar(String username, String accessToken);
   
}