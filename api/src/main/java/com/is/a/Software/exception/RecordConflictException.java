package com.is.a.Software.exception;

public class RecordConflictException extends RuntimeException {

    public RecordConflictException(String subdomain, String recordName, String type) {
        super("An " + type + " record with the name '" + recordName + "' already exists for the domain '" + subdomain + ".is-a.software'. " +
              "A, AAAA, and CNAME records must be unique per hostname.");
    }
}
