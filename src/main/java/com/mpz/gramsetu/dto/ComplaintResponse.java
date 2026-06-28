package com.mpz.gramsetu.dto;

import com.mpz.gramsetu.entity.ComplaintStatus;
import java.time.LocalDateTime;

public record ComplaintResponse(
        Long id,
        String userName,
        String description,
        String imageUrl,
        Boolean anonymous,
        ComplaintStatus status,
        LocalDateTime createdAt
){}
