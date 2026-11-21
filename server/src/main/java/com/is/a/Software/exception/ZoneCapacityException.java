package com.is.a.Software.exception;

/** The is-a.software zone has reached Cloudflare's record limit, so no new records fit. */
public class ZoneCapacityException extends RuntimeException {

    public ZoneCapacityException() {
        super("is-a.software is full right now: no new DNS records can be added. Please try again later.");
    }
}
