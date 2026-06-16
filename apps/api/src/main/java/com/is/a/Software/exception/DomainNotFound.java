package com.is.a.Software.exception;

public class DomainNotFound extends RuntimeException {

	public DomainNotFound() {
		super("User Not Found");
	}

	public DomainNotFound(String message) {
		super(message);
	}	
}
