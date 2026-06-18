
package com.is.a.Software.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.is.a.Software.dto.TempUserDto;
import com.is.a.Software.dto.UserDto;

@Service
public class OtpService {

    // registration otp
    private Map<String, TempUserDto> tempStorage = new HashMap<>();
    private Map<String, Long> tempTimestamp = new HashMap<>();  

    // email change otp
    private Map<String, Integer> emailOtpStorage = new HashMap<>();
    private Map<String, Long> emailOtpTimestamp = new HashMap<>();  

    // Registration
    public void saveTempUser(String email, UserDto userDto, int otp) {
        tempStorage.put(email, new TempUserDto(otp, userDto));
        tempTimestamp.put(email, System.currentTimeMillis());  
    }

    public TempUserDto getTempUser(String email) {
        if (!tempStorage.containsKey(email)) return null;
        Long savedTime = tempTimestamp.get(email);
        if (savedTime == null) return null;
        
        if (System.currentTimeMillis() - savedTime > 60000) {
            tempStorage.remove(email);
            tempTimestamp.remove(email);
            return null;
        }
        return tempStorage.get(email);
    }

    public void removeTempUser(String email) {
        tempStorage.remove(email);
        tempTimestamp.remove(email);
    }

    public Long getTempTimestamp(String email) {
        return tempTimestamp.get(email);
    }

    // email change
    public void saveEmailOtp(String email, int otp) {
        emailOtpStorage.put(email, otp);
        emailOtpTimestamp.put(email, System.currentTimeMillis());
    }

    public Integer getEmailOtp(String email) {
        if (!emailOtpStorage.containsKey(email)) return null;
        Long savedTime = emailOtpTimestamp.get(email);
        if (savedTime == null) return null;
        if (System.currentTimeMillis() - savedTime > 60000) {
            emailOtpStorage.remove(email);
            emailOtpTimestamp.remove(email);
            return null;
        }
        return emailOtpStorage.get(email);
    }

    public void removeEmailOtp(String email) {
        emailOtpStorage.remove(email);
        emailOtpTimestamp.remove(email);
    }
}