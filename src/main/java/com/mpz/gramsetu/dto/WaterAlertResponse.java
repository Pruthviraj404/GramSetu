package com.mpz.gramsetu.dto;

import java.time.LocalDateTime;

public record WaterAlertResponse(
    Long id,
    String createdByName,
    String area,
    String message,
    LocalDateTime createdAt
) {}