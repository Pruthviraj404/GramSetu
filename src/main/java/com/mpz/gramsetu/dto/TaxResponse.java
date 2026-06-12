package com.mpz.gramsetu.dto;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.TaxType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaxResponse (

    Long id,
    Long userId,
    String userName,
    TaxType taxType,
    Double amount,
    LocalDate dueDate,
    TaxStatus status,
    LocalDateTime createdAt


    
){}
