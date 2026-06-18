package com.is.a.Software.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.service.CloudflareService;

@RestController
@RequestMapping("v1/api/cloudflare")
public class CloudflareController {

    private final CloudflareService cloudflareService;

    public CloudflareController(CloudflareService cloudflareService) {
        this.cloudflareService = cloudflareService;
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken() {
        Map<String, Object> result = cloudflareService.verifyToken();
        return ResponseEntity.ok(result);
    }
}
