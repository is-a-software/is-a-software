	package com.is.a.Software.service.Impl;
	
	import java.util.Random;
	import com.is.a.Software.entity.util.PlanLimit;
	
	import org.modelmapper.ModelMapper;
	import org.springframework.security.crypto.password.PasswordEncoder;
	import org.springframework.stereotype.Service;
	
	import com.is.a.Software.dto.LimitDto;
	import com.is.a.Software.dto.SubscriptionDto;
	import com.is.a.Software.dto.UpdateUsernameDto;
	import com.is.a.Software.dto.UserResponseDto;
import com.is.a.Software.entity.Social;
import com.is.a.Software.entity.User;
	import com.is.a.Software.entity.Enum.Plan;
	import com.is.a.Software.entity.util.Mail;
	import com.is.a.Software.exception.UserNotFoundException;
	import com.is.a.Software.exception.WrongPasswordException;
	import com.is.a.Software.repository.DnsRepository;
import com.is.a.Software.repository.SocialRepository;
import com.is.a.Software.repository.UserRepository;
	import com.is.a.Software.service.OtpService;
	import com.is.a.Software.service.SubscriptionService;
	import com.is.a.Software.service.UserService;
	
	@Service
	public class UserServiceImpl implements UserService {
	
		private UserRepository userRepo;
		private SubscriptionService subService;
		private DnsRepository dnsRepo;
		private PasswordEncoder passwordEncoder;
		private Mail mail;
		private OtpService otpService;
		private ModelMapper modelmapper;
		private SocialRepository socialRepo;
	
		
		
	
public UserServiceImpl(UserRepository userRepo, SubscriptionService subService, DnsRepository dnsRepo,
				PasswordEncoder passwordEncoder, Mail mail, OtpService otpService, ModelMapper modelmapper,
				SocialRepository socialRepo) {
			super();
			this.userRepo = userRepo;
			this.subService = subService;
			this.dnsRepo = dnsRepo;
			this.passwordEncoder = passwordEncoder;
			this.mail = mail;
			this.otpService = otpService;
			this.modelmapper = modelmapper;
			this.socialRepo = socialRepo;
		}


		
		
@Override
public LimitDto getLimits(String email) {
    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    SubscriptionDto subDto = subService.getUserSubscription(email);
    Plan currentPlan = subDto.getPlan();

    int recordLimit = PlanLimit.getDnsLimit(currentPlan);
    int used = dnsRepo.countByDomainUser(user);

  
    boolean bonusClaimed = false;
    try {
        Social social = socialRepo.findByUser(user).orElse(null);
        if (social != null && social.isBonusClaimed()) {
            bonusClaimed = true;
            recordLimit += 3;
        }
    } catch (Exception e) {
        
    }

    LimitDto dto = new LimitDto();
    dto.setRecordsUsed(used);
    dto.setRecordLimit(recordLimit);
    dto.setGithubBonus(bonusClaimed);
    dto.setPremium(currentPlan != Plan.FREE);
    return dto;
}
		@Override
		public UpdateUsernameDto updateUsername(String email, String name) {
	
			User user = userRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("user not found"));
	
			user.setName(name);
	
			User updatedUser = userRepo.save(user);
	
			UpdateUsernameDto userdto = new UpdateUsernameDto();
			userdto.setUpdatedName(updatedUser.getName());
			userdto.setEmail(updatedUser.getEmail());
	
			return userdto;
		}
	
		@Override
		public void verifyPasswordAndSendOtp(String oldEmail, String email, String password) {
	
			User user = userRepo.findByEmail(oldEmail).orElseThrow(() -> new UserNotFoundException("user not found"));
	
			if (!passwordEncoder.matches(password, user.getPassword())) {
				throw new WrongPasswordException("Wrong Password");
			}
	
			if (userRepo.existsByEmail(email)) {
				throw new RuntimeException("Email already exists");
			}
	
			int otp = new Random().nextInt(900000) + 100000;
	
			otpService.saveEmailOtp(email, otp);
	
			mail.sendMail(email, otp);
			System.out.print(otp + "tera otp");
	
		}
	
		@Override
		public UserResponseDto updateEmailVerifyOtp(String oldEmail, String newEmail, int otp) {
			Integer StoredOtp = otpService.getEmailOtp(newEmail);
	
			if (StoredOtp == null) {
				throw new RuntimeException("Something Went Wrong Otp Not Generated");
			}
	
			if (!StoredOtp.equals(otp)) {
				throw new RuntimeException("Invalid Otp");
			}
	
			User user = userRepo.findByEmail(oldEmail).orElseThrow(() -> new UserNotFoundException("User Not Found"));
	
			user.setEmail(newEmail);
	
			User updatedUser = userRepo.save(user);
	
			otpService.removeEmailOtp(newEmail);
	
			UserResponseDto responseDto = modelmapper.map(updatedUser, UserResponseDto.class);
	
			return responseDto;
	
		}
	
	}
