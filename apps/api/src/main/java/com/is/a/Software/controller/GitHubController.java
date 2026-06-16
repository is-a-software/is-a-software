package com.is.a.Software.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.entity.Social;
import com.is.a.Software.entity.User;
import com.is.a.Software.repository.SocialRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.security.JwtService;
import com.is.a.Software.service.GithubService;


import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("v1/api/github")
public class GitHubController {

    private final GithubService githubService;
    private final UserRepository userRepository;
    private final SocialRepository socialRepository;
    private final JwtService jwtService;
   
    
    @Value("${app.frontend.url}")
    private String frontendUrl;

    public GitHubController(GithubService githubService, UserRepository userRepository, 
                            SocialRepository socialRepository, JwtService jwtService) {
        this.githubService = githubService;
        this.userRepository = userRepository;
        this.socialRepository = socialRepository;
        this.jwtService = jwtService;
       
    }

    @GetMapping("/auth/start")
    public void startAuth(
            @RequestParam(required = false) String redirect_uri,
            @RequestParam(defaultValue = "connect") String mode,
            @RequestParam(required = false) String token,
            HttpServletResponse response,
            HttpSession session
    ) throws IOException {
        
        if (token != null && !token.isEmpty()) {
            session.setAttribute("pending_token", token);
        }
        
        String email = jwtService.getUsername(token);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        session.setAttribute("pending_user_id", user.getId());
        session.setAttribute("pending_mode", mode);
        
        String state = user.getId() + ":" + mode + ":" + System.currentTimeMillis();
        
        String callbackUri = (redirect_uri != null && !redirect_uri.isEmpty()) 
            ? redirect_uri 
            : frontendUrl + "/github/callback";
        
        String url = githubService.getGithubRedirectUrl(callbackUri, state);
        
        response.sendRedirect(url);
    }

    @GetMapping("/auth/callback")
    public void callback(
            @RequestParam String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            HttpServletResponse response,
            HttpSession session
    ) throws IOException {
        
        String frontendCallback = frontendUrl + "/github/callback";
        
        if (error != null) {
            response.sendRedirect(frontendCallback + "?error=" + error);
            return;
        }
        
        try {
            String[] parts = state.split(":");
            int userId = Integer.parseInt(parts[0]);
            String mode = parts[1];
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = (String) session.getAttribute("pending_token");
            
            String redirect = githubService.handleCallback(code, mode, frontendCallback, user, token);
            
            session.removeAttribute("pending_token");
            session.removeAttribute("pending_user_id");
            session.removeAttribute("pending_mode");
            
            response.sendRedirect(redirect);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(frontendCallback + "?error=" + e.getMessage());
        }
    }

   
    @GetMapping("/status")
    public ResponseEntity<?> getGitHubStatus(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Social social = socialRepository.findByUser(user).orElse(null);
            
            Map<String, Object> response = new HashMap<>();
            if (social != null && social.getGithub() != null && !social.getGithub().isEmpty()) {
                response.put("connected", true);
                response.put("username", social.getGithub());
                response.put("starred", social.isGithubStar());
                response.put("verified", social.isGithubStar());
                response.put("lastCheck", social.getLastCheck());
            } else {
                response.put("connected", false);
                response.put("username", null);
                response.put("starred", false);
                response.put("verified", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("connected", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyStar(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String username = body.get("username");
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Social social = socialRepository.findByUser(user).orElse(null);
            if (social == null || social.getGithub() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("verified", false);
                response.put("starred", false);
                response.put("message", "GitHub not connected");
                return ResponseEntity.ok(response);
            }
            
            boolean currentStarStatus = social.isGithubStar();
            
            Map<String, Object> response = new HashMap<>();
            response.put("verified", currentStarStatus);
            response.put("starred", currentStarStatus);
            response.put("username", social.getGithub());
            
            if (!currentStarStatus) {
                response.put("message", "Star not verified. Please star the repository and click Reconnect GitHub.");
            } else {
                response.put("message", "Star verified! Bonus active.");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("verified", false);
            response.put("starred", false);
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}