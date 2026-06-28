package com.mpz.gramsetu.dto;


import com.mpz.gramsetu.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UserRequest (

    @NotBlank(message="Name is required")
    String name,

    @NotBlank(message= "Mobile number is required")
    
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    String mobileNumber,

    @NotNull(message = "Role is required")
    Role role,

    @NotBlank(message="House number is required")
    String houseNumber,

    @NotBlank(message = "Area is required")
    String area,

  

    String address
){}
