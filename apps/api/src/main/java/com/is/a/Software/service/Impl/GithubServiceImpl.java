package com.is.a.Software.service.Impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.is.a.Software.dto.GitTokenResonse;
import com.is.a.Software.dto.GithubUserDto;
import com.is.a.Software.entity.User;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.GithubService;
import com.is.a.Software.service.SocialService;

@Service
public class GithubServiceImpl implements GithubService {

    @Value("${github.client.id}")
    private String clientId;

    @Value("${github.client.secret}")
    private String clientSecret;
    
    @Value("${github.repo.owner}")
    private String owner;
    
    @Value("${github.repo.name}")
    private String repo;
    
    
    @Value("${app.backend.url}")
    private String backendUrl;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    private final SocialService socialservice;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public GithubServiceImpl(SocialService socialservice, UserRepository userRepository) {
        this.socialservice = socialservice;
        this.userRepository = userRepository;
    }

    @Override
    public String getGithubRedirectUrl(String redirectUri, String state) {
      
        String callbackUrl = backendUrl + "/v1/api/github/auth/callback";
        
        String url = "https://github.com/login/oauth/authorize" +
                "?client_id=" + clientId +
                "&redirect_uri=" + callbackUrl + 
                "&scope=read:user%20public_repo" +
                "&state=" + state;
        
       
        return url;
    }

    @Override
    public String handleCallback(String code, String mode, String redirectUri, User user, String token) {
        try {
            String tokenUrl = "https://github.com/login/oauth/access_token";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            
            Map<String, String> body = new HashMap<>();
            body.put("client_id", clientId);
            body.put("client_secret", clientSecret);
            body.put("code", code);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<GitTokenResonse> tokenResponse =
                    restTemplate.postForEntity(tokenUrl, request, GitTokenResonse.class);
            
            String accessToken = tokenResponse.getBody().getAccess_token();
            
            
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            
            HttpEntity<Void> userReq = new HttpEntity<>(userHeaders);
            
            ResponseEntity<GithubUserDto> userResp =
                    restTemplate.exchange(
                            "https://api.github.com/user",
                            HttpMethod.GET,
                            userReq,
                            GithubUserDto.class
                    );
            
            String username = userResp.getBody().getLogin();
            
            
            boolean starred = verifyStar(username, accessToken);
            
            socialservice.saveGithubData(user, username, starred);
            
           
            String frontendCallback = frontendUrl + "/github/callback";
            
            StringBuilder redirect = new StringBuilder(frontendCallback)
                    .append("?authenticated=true")
                    .append("&starred=").append(starred)
                    .append("&username=").append(username)
                    .append("&mode=").append(mode);
            
            if (token != null && !token.isEmpty()) {
                redirect.append("&token=").append(token);
            }
            
           
            return redirect.toString();
            
        } catch (Exception e) {
            e.printStackTrace();
            String frontendCallback = frontendUrl + "/github/callback";
            return frontendCallback + "?error=github_auth_failed&message=" + e.getMessage();
        }
    }
    

    
    @Override
    public boolean verifyStar(String username, String accessToken) {
        try {
            String url = "https://api.github.com/user/starred/" + owner + "/" + repo;
            

            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("Cache-Control", "no-cache"); 
            headers.set("If-None-Match", "");         
            
            HttpEntity<Void> req = new HttpEntity<>(headers);
            
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.GET, req, String.class);
            
            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Headers: " + response.getHeaders());
            
            boolean starred = response.getStatusCode() == HttpStatus.NO_CONTENT;
            System.out.println("Starred: " + starred);
            
            return starred;
            
        } catch (HttpClientErrorException e) {
            System.out.println("Star verification failed: " + e.getStatusCode());
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                System.out.println("User has NOT starred the repository");
                return false;
            }
            return false;
        }
    }
}