package com.is.a.Software.exception;


public class DuplicateUserException extends RuntimeException{

	
	public DuplicateUserException(String message) {
	  super(message);
	}
	
	public DuplicateUserException () {
		super("Duplicate Email");
	}
	
	
}
