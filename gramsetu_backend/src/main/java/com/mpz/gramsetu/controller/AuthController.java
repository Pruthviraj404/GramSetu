package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.AuthResponse;
import com.mpz.gramsetu.dto.SendOtpRequest;
import com.mpz.gramsetu.dto.SignupRequest;
import com.mpz.gramsetu.dto.SignupResponse;
import com.mpz.gramsetu.dto.VerifyOtpRequest;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.repository.UserRepository;
import com.mpz.gramsetu.security.JwtUtil;
import com.mpz.gramsetu.service.OtpService;
import com.mpz.gramsetu.service.SignupService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final OtpService otpService;
    private final SignupService signupService;

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<SignupResponse> register(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signupService.register(request));

    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody SendOtpRequest request) {
        if (!userRepository.existsByMobileNumber(request.mobileNumber())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mobile number not registered. Gram Panchayat.");
        }

        String otp = otpService.generateAndStoreOtp(request.mobileNumber());
        System.out.println("OTp for " + request.mobileNumber() + ":" + otp);

        return ResponseEntity.ok("Otp sent successfully !!!.");

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (!otpService.validateOtp(request.mobileNumber(), request.otp())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or Expired OTP.");
        }

        User user = userRepository.findByMobileNumber(request.mobileNumber())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getMobileNumber(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getName(),user.isApproved()));

    }

    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userRepository.findByIsApprovedFalse());

    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully");
    }

    @DeleteMapping("/reject/{id}")
    public ResponseEntity<String> rejectUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User registration rejected and removed.");
    }

}
