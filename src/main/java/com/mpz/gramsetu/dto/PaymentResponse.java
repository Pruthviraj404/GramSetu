package com.mpz.gramsetu.dto;


import java.time.LocalDateTime;

public record PaymentResponse(

    Long id,
    Long userId,
    String userName,
    Long taxId,
    String taxType,
    Double amount, 
    String transactionId,
    LocalDateTime paymentDate
){}
