package com.is.a.Software.service.Impl;

import java.security.SecureRandom;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.is.a.Software.dto.UserDto;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.Role;
import com.is.a.Software.entity.Enum.UserStatus;
import com.is.a.Software.entity.util.EmailSerive;
import com.is.a.Software.exception.DuplicateUserException;
import com.is.a.Software.exception.UserNotFoundException;
import com.is.a.Software.exception.WrongPasswordException;
import com.is.a.Software.repository.UserRepository;
import com.is.a.Software.security.JwtService;
import com.is.a.Software.service.AuthService;
import com.is.a.Software.repository.SubscriptionRepository;
import com.is.a.Software.entity.Subscription;
import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.entity.Enum.SubscriptionStatus;
import java.time.LocalDate;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
    private final EmailSerive emailService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncode;
    private final ModelMapper modelmapper;
    private final SubscriptionRepository subscriptionRepo;   

    
    public AuthServiceImpl(UserRepository userRepository, 
                           EmailSerive emailService, 
                           JwtService jwtService,
                           PasswordEncoder passwordEncode, 
                           ModelMapper modelmapper,
                           SubscriptionRepository subscriptionRepo) {   
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.passwordEncode = passwordEncode;
        this.modelmapper = modelmapper;
        this.subscriptionRepo = subscriptionRepo;   
    }

	@Override
	public void forgotPassword(String email) {
		
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Invalid email");
        }

        
    
        String token = jwtService.generateResetToken(email);

    
        String link = "http://localhost:3000/reset-password?token=" + token;

    
        emailService.sendResetEmail(email, link);
	}

	@Override
	public void resetPassword(String token, String newPassword) {

        String email;

        try {
            email = jwtService.validateResetToken(token);
        } catch (Exception e) {
            throw new RuntimeException("Token expired or invalid");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        user.setPassword(passwordEncode.encode(newPassword));

        userRepository.save(user);
    }

	@Override
    public UserDto registerUser(UserDto userdto) {
        if (userRepository.existsByEmail(userdto.getEmail())) {
            throw new DuplicateUserException("Already have an account duplicate email");
        }
        User user = modelmapper.map(userdto, User.class);
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncode.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

       
        Subscription freeSub = new Subscription();
        freeSub.setUser(savedUser);
        freeSub.setPlan(Plan.FREE);
        freeSub.setStatus(SubscriptionStatus.ACTIVE);
        freeSub.setStart_date(LocalDate.now());
        freeSub.setEnd_date(null);   
        subscriptionRepo.save(freeSub);

        return modelmapper.map(savedUser, UserDto.class);
    }
	
	@Override
	public int returnOtp() {
		SecureRandom random = new SecureRandom();
		
		int otp = 100000 + random.nextInt(900000);
	
		return otp;
		}
	
		@Override
		public void changePassword(String email, String oldPassword, String newPassword) {
			User user = userRepository.findByEmail(email).orElseThrow(() ->  new UserNotFoundException("user not found"));
			
			if(!passwordEncode.matches(oldPassword, user.getPassword())) {
				throw new WrongPasswordException("Invalid Password");
			}
			
			user.setPassword(passwordEncode.encode(newPassword));
		    userRepository.save(user);	
			
		}

	

}
