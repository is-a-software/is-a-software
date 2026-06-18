package com.is.a.Software.exception;

public class SubscriptionRequiredException extends RuntimeException {

    public SubscriptionRequiredException() {
        super("No active subscription found. Please subscribe to add DNS records.");
    }

    public SubscriptionRequiredException(String message) {
        super(message);
    }
}
