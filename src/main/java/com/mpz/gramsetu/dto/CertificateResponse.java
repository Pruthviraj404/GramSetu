package com.mpz.gramsetu.dto;

import com.mpz.gramsetu.entity.CertificateStatus;
import com.mpz.gramsetu.entity.CertificateType;
import java.time.LocalDateTime;

public record CertificateResponse(
    Long id,
    Long userId,
    String userName,
    CertificateType certificateType,
    String documentUrl,
    CertificateStatus status,
    String certificateNumber,
    String generatedCertificateUrl,

    String verifiedByName,
    LocalDateTime verifiedAt,
    String verificationRemarks,

    String approvedByName,
    LocalDateTime approvedAt,
    String approvalRemarks,

    LocalDateTime rejectedAt,
    String rejectionRemarks,

    LocalDateTime generatedAt,
    LocalDateTime appliedDate,
    LocalDateTime updatedAt
) {}