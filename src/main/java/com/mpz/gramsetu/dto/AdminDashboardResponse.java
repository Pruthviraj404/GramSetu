package com.mpz.gramsetu.dto;

import java.util.List;

public record AdminDashboardResponse (

    //citizen stats
    long totalCitizens,
    long totalWatermen,

    //tax
    long totalTaxRecords,
    long pendingTaxCounts,
    long paidTaxCount,
    double totalTaxCollections,
    double totalPendingDues,

    //complaints
    long totalComplaints,
    long submittedComplaints,
    long underReviewComplaints,
    long resolvedComplaints,

    //certificates
    long totalCertificationApplications,
    long pendingCertificates,
    long underVerificationsCertificates,
    long approvedCertificates,
    long generatedCertificates,
    long rejectedCertificates,

    //Payment
    long totalPayments,
    double totalRevenueCollected,

    List<ComplaintResponse> recentComplaints,
    List<CertificateResponse> recentCertificateApplications,
    List<NotificationResponse> recentNotifications




    
){}