package com.is.a.Software.entity.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;

@Component
public class Mail {

	@Autowired
	private JavaMailSender mailSender;
	
	public void sendMail(String email,int otp) {
		 try {
		        MimeMessage message = mailSender.createMimeMessage();
		        MimeMessageHelper
		        helper = new MimeMessageHelper(message, true);

		        helper.setTo(email);
		        helper.setSubject("🔐 OTP Verification - Is A Software");

		        String content = """
		        	    <div style="font-family: Arial, sans-serif; padding: 20px;">
		        	        <h2 style="color: #2c3e50;">Is A Software</h2>
		        	        <p>Dear User,</p>
		        	        
		        	        <p>Thank you for choosing <b>Is A Software</b>.</p>
		        	        
		        	        <p>Your One-Time Password (OTP) for verification is:</p>
		        	        
		        	        <h1 style="color: #e74c3c; letter-spacing: 3px;">""" 
		        	        + otp + 
		        	        """
		        	        </h1>
		        	        
		        	        <p>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>
		        	        
		        	        <p>If you did not request this OTP, please ignore this email.</p>
		        	        
		        	        <br/>
		        	        <p>Regards,<br/>
		        	        <b>Is A Software Team</b></p>
		        	    </div>
		        	    """;
		              

		        helper.setText(content, true);

		        mailSender.send(message);

		    } catch (Exception e) {
		        e.printStackTrace();
		    }
	}
}
