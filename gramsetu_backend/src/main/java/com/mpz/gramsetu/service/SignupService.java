package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.SignupRequest;
import com.mpz.gramsetu.dto.SignupResponse;
import com.mpz.gramsetu.entity.Role;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class SignupService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SignupResponse register(SignupRequest request) {
        if (userRepository.existsByMobileNumber(request.mobileNumber())) {
            throw new IllegalArgumentException("Mobile number already registered.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered.");
        }

        User user = User.builder()
                .name(request.name())
                .mobileNumber(request.mobileNumber())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .address(request.address())
                .area(request.area())
                .role(Role.CITIZEN)
                .houseNumber(request.houseNumber())
                .isApproved(false)
                .build();

        userRepository.save(user);

        return new SignupResponse(
                "Registration successful! Wait for admin approval before logging in.",
                user.getName(),
                user.getMobileNumber()

        );
    }

}
