package com.mpz.gramsetu.dto;


import com.mpz.gramsetu.entity.Role;
import java.time.LocalDateTime;

public record UserResponse(

    Long id,
    String name,
    String mobileNumber,
    Role role,
    String houseNumber,
    String area,
    String address,
    LocalDateTime createdAt
    
){}
