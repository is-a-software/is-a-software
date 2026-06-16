package com.is.a.Software.exception;

import java.util.List;
import java.util.Map;

public class CloudflareApiException extends RuntimeException {

    private final int cfStatusCode;
    private final List<Map<String, Object>> cfErrors;

    public CloudflareApiException(String message, int cfStatusCode, List<Map<String, Object>> cfErrors) {
        super(message);
        this.cfStatusCode = cfStatusCode;
        this.cfErrors = cfErrors;
    }

    public int getCfStatusCode() {
        return cfStatusCode;
    }

    public List<Map<String, Object>> getCfErrors() {
        return cfErrors;
    }
}
