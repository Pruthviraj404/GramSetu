package com.mpz.gramsetu.dto;

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank(message = "Name is Required") String name,

        @Email(message = "Invalid email") @NotBlank(message = "Email is required") String email,

        @NotBlank(message = "Mobile number is required") @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number") String mobileNumber,

        @NotBlank(message = "Password is required") String password,

        @NotBlank(message = "Area is required") String area,

        @NotBlank(message = "House number is required") String houseNumber,

        String address

) {
}
