package com.is.a.Software.exception;

public class DnsLimitExceededException extends RuntimeException {

    private final int limit;

    public DnsLimitExceededException(int limit) {
        super("DNS record limit exceeded. Maximum allowed: " + limit);
        this.limit = limit;
    }

    public int getLimit() {
        return limit;
    }
}
