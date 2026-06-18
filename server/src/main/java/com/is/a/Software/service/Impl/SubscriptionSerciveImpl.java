package com.is.a.Software.service.Impl;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.is.a.Software.dto.SubscriptionDto;
import com.is.a.Software.entity.Subscription;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.entity.Enum.SubscriptionStatus;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.repository.SubscriptionRepository;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.service.SubscriptionService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;

import org.json.JSONObject;

@Service
public class SubscriptionSerciveImpl implements SubscriptionService {

	private SubscriptionRepository subScriptionRepo;
	private UserRepository userRepo;
	private ModelMapper modelMapper;
	private String razorpayKeyId;
	private String razorpayKeySecret;
	private String premiumUsdPlanId;
	private String premiumInrPlanId;
	private String premiumPlusUsdPlanId;
	private String premiumPlusInrPlanId;
	private Integer subscriptionTotalCount;

	public SubscriptionSerciveImpl(SubscriptionRepository subScriptionRepo, UserRepository userRepo,
			ModelMapper modelMapper, @Value("${razorpay.key.id:}") String razorpayKeyId,
			@Value("${razorpay.key.secret:}") String razorpayKeySecret,
			@Value("${razorpay.plan.premium.usd:}") String premiumUsdPlanId,
			@Value("${razorpay.plan.premium.inr:}") String premiumInrPlanId,
			@Value("${razorpay.plan.premium.plus.usd:}") String premiumPlusUsdPlanId,
			@Value("${razorpay.plan.premium.plus.inr:}") String premiumPlusInrPlanId,
			@Value("${razorpay.subscription.total.count:1}") Integer subscriptionTotalCount) {
		super();
		this.subScriptionRepo = subScriptionRepo;
		this.userRepo = userRepo;
		this.modelMapper = modelMapper;
		this.razorpayKeyId = razorpayKeyId;
		this.razorpayKeySecret = razorpayKeySecret;
		this.premiumUsdPlanId = premiumUsdPlanId;
		this.premiumInrPlanId = premiumInrPlanId;
		this.premiumPlusUsdPlanId = premiumPlusUsdPlanId;
		this.premiumPlusInrPlanId = premiumPlusInrPlanId;
		this.subscriptionTotalCount = subscriptionTotalCount;
	}
	
	@Override
	@Transactional
	public SubscriptionDto getUserSubscription(String email) {
	    User user = userRepo.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    Subscription activeSub = subScriptionRepo.findActiveSubscription(user).orElse(null);
	    if (activeSub != null) {
	        if (activeSub.getEnd_date() != null && activeSub.getEnd_date().isBefore(LocalDate.now())) {
	            activeSub.setStatus(SubscriptionStatus.EXPIRED);
	            subScriptionRepo.save(activeSub);
	        } else {
	            return modelMapper.map(activeSub, SubscriptionDto.class);
	        }
	    }

	    Subscription freePlan = subScriptionRepo.findByUserAndPlan(user, Plan.FREE)
	            .orElseThrow(() -> new RuntimeException("FREE plan missing for user. Please contact support."));

	    if (freePlan.getStatus() != SubscriptionStatus.ACTIVE) {
	        freePlan.setStatus(SubscriptionStatus.ACTIVE);
	        freePlan.setEnd_date(null);
	        freePlan.setStart_date(LocalDate.now());
	        subScriptionRepo.save(freePlan);
	    }

	    return modelMapper.map(freePlan, SubscriptionDto.class);
	}
	
	@Override
	public Map<String, Object> createCheckoutSubscription(String email, Plan plan, String currency) {
		if (plan == Plan.FREE) {
			throw new RuntimeException("Free plan does not require checkout");
		}

		String normalizedCurrency = normalizeCurrency(currency);
		String planId = resolvePlanId(plan, normalizedCurrency);
		ensurePaymentConfigured(planId);

		try {
			RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
			JSONObject options = new JSONObject();
			options.put("plan_id", planId);
			options.put("customer_notify", 1);
			options.put("quantity", 1);
			options.put("total_count", subscriptionTotalCount == null ? 1 : subscriptionTotalCount);

			JSONObject notes = new JSONObject();
			notes.put("userEmail", email);
			notes.put("plan", plan.name());
			notes.put("currency", normalizedCurrency);
			options.put("notes", notes);

			com.razorpay.Subscription razorpaySubscription = client.subscriptions.create(options);

			return Map.of("keyId", razorpayKeyId, "subscriptionId", razorpaySubscription.get("id"), "currency",
					normalizedCurrency, "name", "is-a.software", "description",
					plan == Plan.PREMIUM_PLUS ? "Premium+ plan" : "Premium plan", "email", email);
		} catch (RazorpayException ex) {
			throw new RuntimeException("Unable to create subscription checkout", ex);
		}
	}
	@Override
	public SubscriptionDto confirmCheckout(String email, Plan plan, String currency, String subscriptionId,
	        String paymentId, String signature) {
	    

	    if (subscriptionId == null || subscriptionId.isBlank() || paymentId == null || paymentId.isBlank()
	            || signature == null || signature.isBlank()) {
	        throw new RuntimeException("Missing payment verification fields");
	    }

	    String normalizedCurrency = normalizeCurrency(currency); 
	    String expectedPlanId = resolvePlanId(plan, normalizedCurrency);
	    System.out.println("Expected Plan ID from config: " + expectedPlanId);
	    
	    ensurePaymentConfigured(expectedPlanId);

	    boolean sigValid = isValidSubscriptionSignature(subscriptionId, paymentId, signature);
	    System.out.println("Signature valid: " + sigValid);
	    if (!sigValid) {
	        throw new RuntimeException("Invalid payment signature");
	    }

	    try {
	        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
	        
	        
	        Payment payment = client.payments.fetch(paymentId);
	        if (payment == null) {
	            throw new RuntimeException("Payment not found");
	        }
	        String paymentStatus = stringOrEmpty(payment.get("status"));
	        System.out.println("Payment status: " + paymentStatus);
	        
	        if (!isSuccessfulPaymentStatus(paymentStatus)) {
	            throw new RuntimeException("Payment is not completed");
	        }
	        

	        com.razorpay.Subscription razorpaySubscription = client.subscriptions.fetch(subscriptionId);
	        if (razorpaySubscription == null) {
	            throw new RuntimeException("Subscription not found");
	        }
	        String actualPlanId = stringOrEmpty(razorpaySubscription.get("plan_id"));
	        String subscriptionStatus = stringOrEmpty(razorpaySubscription.get("status"));
	        
	        System.out.println("Actual Plan ID from Razorpay: " + actualPlanId);
	        System.out.println("Subscription status from Razorpay: " + subscriptionStatus);
	        
	        if (!expectedPlanId.equals(actualPlanId)) {
	            throw new RuntimeException("Subscription plan mismatch. Expected: " + expectedPlanId + ", Actual: " + actualPlanId);
	        }

	        if (!isEligibleSubscriptionStatus(subscriptionStatus)) {
	            throw new RuntimeException("Subscription is not active");
	        }

	        activatePlan(email, plan);
	        System.out.println("Plan activated successfully.");
	        return getUserSubscription(email);
	        
	    } catch (RazorpayException ex) {
	        ex.printStackTrace();
	        throw new RuntimeException("Unable to verify payment: " + ex.getMessage(), ex);
	    }
	}
	
	private void activatePlan(String email, Plan plan) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Subscription> activeSubs = subScriptionRepo.findByUserAndStatus(user, SubscriptionStatus.ACTIVE);
        for (Subscription sub : activeSubs) {
            sub.setStatus(SubscriptionStatus.EXPIRED);
            if (sub.getPlan() == Plan.FREE) {
                sub.setEnd_date(LocalDate.now());  
            }
            subScriptionRepo.save(sub);
        }
        
        Subscription newSub = new Subscription();
        newSub.setUser(user);
        newSub.setPlan(plan);
        newSub.setStatus(SubscriptionStatus.ACTIVE);
        newSub.setStart_date(LocalDate.now());
        newSub.setEnd_date(LocalDate.now().plusYears(1));
        subScriptionRepo.save(newSub);
    }

	private String resolvePlanId(Plan plan, String currency) {
		if (plan == Plan.PREMIUM) {
			return "INR".equals(currency) ? premiumInrPlanId : premiumUsdPlanId;
		}
		if (plan == Plan.PREMIUM_PLUS ) {
			return "INR".equals(currency) ? premiumPlusInrPlanId : premiumPlusUsdPlanId;
		}
		throw new RuntimeException("Unsupported plan for checkout");
	}

	private String normalizeCurrency(String currency) {
		return "INR";
	}

	private void ensurePaymentConfigured(String planId) {
		if (razorpayKeyId == null || razorpayKeyId.isBlank() || razorpayKeySecret == null
				|| razorpayKeySecret.isBlank()) {
			throw new RuntimeException("Payment gateway is not configured");
		}
		if (planId == null || planId.isBlank()) {
			throw new RuntimeException("Missing Razorpay plan_id configuration");
		}
	}

	private boolean isValidSubscriptionSignature(String subscriptionId, String paymentId, String signature) {
		String payload = paymentId + "|" + subscriptionId;
		String generatedSignature = hmacSha256Hex(payload, razorpayKeySecret);
		return generatedSignature.equalsIgnoreCase(signature);
	}

	private String hmacSha256Hex(String payload, String secret) {
		try {
			Mac sha256Hmac = Mac.getInstance("HmacSHA256");
			SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
			sha256Hmac.init(secretKey);
			byte[] signedBytes = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
			return toHex(signedBytes);
		} catch (NoSuchAlgorithmException | InvalidKeyException ex) {
			throw new RuntimeException("Unable to verify payment signature", ex);
		}
	}

	private String toHex(byte[] data) {
		StringBuilder sb = new StringBuilder(data.length * 2);
		for (byte b : data) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}

	private boolean isSuccessfulPaymentStatus(String status) {
		return "captured".equalsIgnoreCase(status) || "authorized".equalsIgnoreCase(status);
	}

	private boolean isEligibleSubscriptionStatus(String status) {
		return "active".equalsIgnoreCase(status) || "authenticated".equalsIgnoreCase(status)
				|| "completed".equalsIgnoreCase(status) || "created".equalsIgnoreCase(status)
				|| "pending".equalsIgnoreCase(status);
	}

	private String stringOrEmpty(Object value) {
		return value == null ? "" : String.valueOf(value);
	}
}