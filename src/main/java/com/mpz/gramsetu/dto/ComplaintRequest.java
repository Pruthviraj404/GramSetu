package com.mpz.gramsetu.dto;

import jakarta.validation.constraints.NotBlank;

public record ComplaintRequest (
    @NotBlank(message = "Description is required")
    String description,

    String imageUrl,

    Boolean anonymous
    
){}
