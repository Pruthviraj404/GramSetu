package com.mpz.gramsetu.dto;

import com.mpz.gramsetu.entity.Notification;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationRequest (

    @NotBlank(message = "Title is required")
     String title,

    @NotBlank(message = "Message is required")
     String  message,

    String targetArea,

    @NotNull(message = "Notification type is required")
    NotificationType type

    



    
){}
