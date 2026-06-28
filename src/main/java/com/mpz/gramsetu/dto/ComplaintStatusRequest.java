package com.mpz.gramsetu.dto;

import com.mpz.gramsetu.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record ComplaintStatusRequest(
    @NotNull(message = "Status is required")
    ComplaintStatus status
) {}