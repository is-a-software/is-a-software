package com.is.a.Software.exception;

public class RecordNotFoundException extends RuntimeException {

    public RecordNotFoundException(int recordId) {
        super("DNS record not found: " + recordId);
    }

    public RecordNotFoundException(String message) {
        super(message);
    }
}
