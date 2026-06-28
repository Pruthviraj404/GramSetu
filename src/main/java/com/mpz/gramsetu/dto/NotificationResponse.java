package com.mpz.gramsetu.dto;

import com.mpz.gramsetu.dto.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse (
    
    Long id,
    String title,
    String message,
    String targetArea,
    NotificationType type,
    LocalDateTime createdAt

){}