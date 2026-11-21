package com.is.a.Software.exception.handling;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.is.a.Software.exception.CloudflareApiException;
import com.is.a.Software.exception.DnsLimitExceededException;
import com.is.a.Software.exception.DomainNotFound;
import com.is.a.Software.exception.InvalidRecordValueException;
import com.is.a.Software.exception.RecordConflictException;
import com.is.a.Software.exception.RecordNotFoundException;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.exception.ZoneCapacityException;

@RestControllerAdvice
public class GlobalExceptionHandling {




	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		List<ObjectError> allErrors = ex.getBindingResult().getAllErrors();
		allErrors.forEach(error -> {
			String field = ((FieldError) error).getField();
			String message = error.getDefaultMessage();
			errors.put(field, message);
		});
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}


	@ExceptionHandler(DomainNotFound.class)
	public ResponseEntity<Map<String, Object>> handleDomainNotFound(DomainNotFound ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}


	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}


	@ExceptionHandler(RecordNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleRecordNotFound(RecordNotFoundException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}




	@ExceptionHandler(DnsLimitExceededException.class)
	public ResponseEntity<Map<String, Object>> handleDnsLimitExceeded(DnsLimitExceededException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.FORBIDDEN.value());
		body.put("limit", ex.getLimit());
		return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
	}




	@ExceptionHandler(InvalidRecordValueException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidRecordValue(InvalidRecordValueException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.UNPROCESSABLE_ENTITY.value());
		return new ResponseEntity<>(body, HttpStatus.UNPROCESSABLE_ENTITY);
	}


	@ExceptionHandler(RecordConflictException.class)
	public ResponseEntity<Map<String, Object>> handleRecordConflict(RecordConflictException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.CONFLICT.value());
		return new ResponseEntity<>(body, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ZoneCapacityException.class)
	public ResponseEntity<Map<String, Object>> handleZoneCapacity(ZoneCapacityException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
		return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
	}

	@ExceptionHandler(CloudflareApiException.class)
	public ResponseEntity<Map<String, Object>> handleCloudflareApi(CloudflareApiException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage());
		body.put("status", HttpStatus.BAD_GATEWAY.value());
		body.put("cfStatusCode", ex.getCfStatusCode());
		body.put("cfErrors", ex.getCfErrors());
		return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
	}


	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", ex.getMessage() == null ? "Request failed" : ex.getMessage());
		body.put("status", HttpStatus.BAD_REQUEST.value());
		return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
	}


	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<Map<String, Object>> handleNoSuchEndpoint(NoResourceFoundException ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", "Not found");
		body.put("status", HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
	}


	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
		Map<String, Object> body = new HashMap<>();
		body.put("message", "An unexpected error occurred: " + ex.getMessage());
		body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
