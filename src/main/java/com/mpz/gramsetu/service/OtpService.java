package com.mpz.gramsetu.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;



@Service

public class OtpService {

    private final Map<String,String> otpStore= new ConcurrentHashMap<>();

    public String generateAndStoreOtp(String mobileNumber){
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(mobileNumber,otp);
        return otp;
    }


    public boolean validateOtp(String mobileNumber, String otp){
        String stored = otpStore.get(mobileNumber);
        if(stored !=null && stored.equals(otp) ){
            otpStore.remove(mobileNumber);
            return true;
        }
        return  false;
    }




    
}
