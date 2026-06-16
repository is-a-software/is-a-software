package com.is.a.Software.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is.a.Software.dto.SubscriptionDto;
import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.service.SubscriptionService;

@RestController
@RequestMapping("/v1/api/premium")
public class PremiumController {

private SubscriptionService subscriptionService;



public PremiumController(SubscriptionService subscriptionService) {
	super();
	this.subscriptionService = subscriptionService;
}



@PostMapping("/checkout")
public ResponseEntity<?> startCheckout(Authentication authentication, @RequestBody Map<String, String> payload) {
if (authentication == null) {
return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
}

String email = authentication.getName();
String planValue = payload.getOrDefault("plan", "PREMIUM");
String currency = payload.getOrDefault("currency", "USD");

Plan plan;
try {
plan = Plan.valueOf(planValue.trim().toUpperCase());
} catch (Exception ex) {
return ResponseEntity.badRequest().body(Map.of("message", "Invalid plan"));
}

Map<String, Object> checkoutPayload = subscriptionService.createCheckoutSubscription(email, plan, currency);
return ResponseEntity.ok(checkoutPayload);
}

@PostMapping("/checkout/confirm")
public ResponseEntity<?> confirmCheckout(Authentication authentication, @RequestBody Map<String, String> payload) {
if (authentication == null) {
return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
}

String email = authentication.getName();
String planValue = payload.getOrDefault("plan", "PREMIUM");
String currency = payload.getOrDefault("currency", "USD");
String subscriptionId = payload.get("subscriptionId");
String paymentId = payload.get("paymentId");
String signature = payload.get("signature");

Plan plan;
try {
plan = Plan.valueOf(planValue.trim().toUpperCase());
} catch (Exception ex) {
	
	
return ResponseEntity.badRequest().body(Map.of("message", "Invalid plan"));
}

SubscriptionDto subscription = subscriptionService.confirmCheckout(email, plan, currency, subscriptionId,
paymentId, signature);

return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "subscription", subscription));
}
}
