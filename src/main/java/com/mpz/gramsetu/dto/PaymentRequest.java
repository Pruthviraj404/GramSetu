package com.mpz.gramsetu.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentRequest (

    @NotNull(message = "Tax id required")
    Long taxId,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be  positive")
    Double amount,

    @NotBlank(message = "Transaction ID is required")
    String transcationId

    
){}
