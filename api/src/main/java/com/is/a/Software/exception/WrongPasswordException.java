package com.is.a.Software.exception;

public class WrongPasswordException extends RuntimeException{

	public WrongPasswordException() {
		super("Invalid password");
	}

	public WrongPasswordException(String message) {
		super(message);
	}

	
	
}
