package com.is.a.Software.entity.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSerive {
	
	
	  private final JavaMailSender mailSender;

	  

	    public EmailSerive(JavaMailSender mailSender) {
		super();
		this.mailSender = mailSender;
	}




		public void sendResetEmail(String to, String link) {
	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setTo(to);
	        message.setSubject("Reset Password (Valid 5 minutes)");
	        message.setText("Click here to reset password (valid 5 min): " + link);

	        mailSender.send(message);
	    }
}
