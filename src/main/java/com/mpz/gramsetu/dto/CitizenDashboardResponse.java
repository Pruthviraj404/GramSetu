package com.mpz.gramsetu.dto;

import java.util.List;


public record CitizenDashboardResponse (
    //tax
    long pendingTaxCount,
    double totalPendingAmount,
    long paidTaxCount,

    //payment
    long totalPaymentsMade,
    double totalAmountPaid,

    //complaint
    long totalComplaints,
    long resolvedComplaints,
    long pendingComplaints,

    //certificate
    long totalCertificationApplications,
    long approvedCertificates,
    long pendingCertificates,

    //recent data
    List<NotificationResponse>recentNotifications,
    List<TaxResponse>pendingTaxes,
    List<PaymentResponse>recentPayments,
    List<ComplaintResponse>recentComplaints,
    List<CertificateResponse>recentCertificates

){}
