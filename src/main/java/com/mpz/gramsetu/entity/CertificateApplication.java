package com.mpz.gramsetu.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificate_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class CertificateApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateType certificateType;

    @Column(nullable = false)
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status;

    // ===== Unique certificate number, e.g. RES-2026-0001 =====
    @Column(unique = true)
    private String certificateNumber;

    // ===== Final generated PDF location =====
    private String generatedCertificateUrl;

    // ===== Audit trail =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    private LocalDateTime verifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime approvedAt;

    private LocalDateTime rejectedAt;

    private LocalDateTime generatedAt;

    // ===== Remarks at each stage =====
    private String verificationRemarks;
    private String approvalRemarks;
    private String rejectionRemarks;

    @CreationTimestamp
    private LocalDateTime appliedDate;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
}
