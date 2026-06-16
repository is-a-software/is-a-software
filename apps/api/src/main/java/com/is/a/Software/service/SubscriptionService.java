package com.is.a.Software.service;

import java.util.Map;

import com.is.a.Software.dto.SubscriptionDto;
import com.is.a.Software.entity.Enum.Plan;

public interface SubscriptionService {

SubscriptionDto getUserSubscription(String email);

Map<String, Object> createCheckoutSubscription(String email, Plan plan, String currency);

SubscriptionDto confirmCheckout(String email, Plan plan, String currency, String subscriptionId, String paymentId,
String signature);

}
