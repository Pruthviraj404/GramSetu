package com.mpz.gramsetu.dto;

import jakarta.validation.constraints.NotBlank;

public record WaterAlertRequest(

    @NotBlank(message = "Area is required")
    String area,

    @NotBlank(message = "Message is required")
    String message
) {}