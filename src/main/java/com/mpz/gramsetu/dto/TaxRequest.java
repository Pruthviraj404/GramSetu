package com.mpz.gramsetu.dto;
import com.mpz.gramsetu.entity.TaxType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;



public record TaxRequest (

    @NotNull(message = "User Id is Required")
    Long userId,

    @NotNull(message = "Tax type is required")
    TaxType taxType,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    Double amount,

    @NotNull(message = "Due Date is required")
    LocalDate duDate



    
){}
