package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.*;
import com.mpz.gramsetu.entity.*;
import com.mpz.gramsetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TaxRepository taxRepository;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final CertificateRepository certificateRepository;
    private final NotificationRepository notificationRepository;

    public CitizenDashboardResponse getCitizenDashboard(User citizen) {
        Long userId = citizen.getId();

        long pendingTaxCount = taxRepository.countByUserIdAndStatus(userId, TaxStatus.PENDING);
        long paidTaxCount = taxRepository.countByUserIdAndStatus(userId, TaxStatus.PAID);
        Double pendingAmountRaw = taxRepository.sumAmountByUserIdAndStatus(userId, TaxStatus.PENDING);
        double totalPendingAmount = pendingAmountRaw != null ? pendingAmountRaw : 0.0;

        long totalPaymentsMade = paymentRepository.countByUserId(userId);
        Double paidAmountRaw = paymentRepository.sumAmountByUserId(userId);
        double totalAmountPaid = paidAmountRaw != null ? paidAmountRaw : 0.0;

        long totalComplaints = complaintRepository.countByUserId(userId);
        long resolvedComplaints = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.RESOLVED);
        long pendingComplaints = complaintRepository.countByUserIdAndStatus(userId, ComplaintStatus.SUBMITTED);

        long totalCertificateApplications = certificateRepository.countByUserId(userId);
        long approvedCertificates = certificateRepository
                .countByUserIdAndStatus(userId, CertificateStatus.APPROVED);
        long pendingCertificates = certificateRepository
                .countByUserIdAndStatus(userId, CertificateStatus.PENDING);

        List<NotificationResponse> recentNotifications = notificationRepository
                .findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrderByCreatedAtDesc(citizen.getArea()).stream().limit(5)
                .map(n -> new NotificationResponse(
                        n.getId(), n.getTitle(), n.getMessage(), n.getTargetArea() == null ? "ALL" : n.getTargetArea(),
                        n.getType(), n.getCreatedAt()))
                .collect(Collectors.toList());

        List<TaxResponse> pendingTaxes = taxRepository
                .findByUserIdAndStatus(userId, TaxStatus.PENDING)
                .stream().limit(5)
                .map(t -> new TaxResponse(
                        t.getId(), t.getUser().getId(), t.getUser().getName(),
                        t.getTaxType(), t.getAmount(), t.getDueDate(),
                        t.getStatus(), t.getCreatedAt()))
                .collect(Collectors.toList());

        // Recent payments (latest 5)
        List<PaymentResponse> recentPayments = paymentRepository
                .findByUserId(userId)
                .stream().limit(5)
                .map(p -> new PaymentResponse(
                        p.getId(), p.getUser().getId(), p.getUser().getName(),
                        p.getTax().getId(), p.getTax().getTaxType().name(),
                        p.getAmount(), p.getTransactionId(), p.getPaymentDate()))
                .collect(Collectors.toList());

        List<ComplaintResponse> recentComplaints = complaintRepository
                .findByUserId(userId)
                .stream().limit(5)
                .map(c -> new ComplaintResponse(
                        c.getId(),
                        c.getAnonymous() ? null : c.getUser().getName(),
                        c.getDescription(), c.getImageUrl(),
                        c.getAnonymous(), c.getStatus(), c.getCreatedAt()))
                .collect(Collectors.toList());

        List<CertificateResponse> recentCertificates = certificateRepository
                .findByUserId(userId)
                .stream().limit(5)
                .map(a -> new CertificateResponse(
                        a.getId(), a.getUser().getId(), a.getUser().getName(),
                        a.getCertificateType(), a.getDocumentUrl(), a.getStatus(),
                        a.getCertificateNumber(), a.getGeneratedCertificateUrl(),
                        a.getVerifiedBy() != null ? a.getVerifiedBy().getName() : null,
                        a.getVerifiedAt(), a.getVerificationRemarks(),
                        a.getApprovedBy() != null ? a.getApprovedBy().getName() : null,
                        a.getApprovedAt(), a.getApprovalRemarks(),
                        a.getRejectedAt(), a.getRejectionRemarks(),
                        a.getGeneratedAt(), a.getAppliedDate(), a.getUpdatedAt()))
                .collect(Collectors.toList());

        return new CitizenDashboardResponse(
                pendingTaxCount, totalPendingAmount, paidTaxCount,
                totalPaymentsMade, totalAmountPaid,
                totalComplaints, resolvedComplaints, pendingComplaints,
                totalCertificateApplications, approvedCertificates, pendingCertificates,
                recentNotifications, pendingTaxes, recentPayments,
                recentComplaints, recentCertificates

        );

    }

    public AdminDashboardResponse getAdminDashboard() {

        long totalCitizens = userRepository.countByRole(Role.CITIZEN);
        long totalWatermen = userRepository.countByRole(Role.WATERMAN);

        long totalTaxRecords = taxRepository.count();
        long pendingTaxCount = taxRepository.countByStatus(TaxStatus.PENDING);
        long paidTaxCount = taxRepository.countByStatus(TaxStatus.PAID);
        Double collectionRaw = taxRepository.sumAmountByStatus(TaxStatus.PAID);
        double totalTaxCollection = collectionRaw != null ? collectionRaw : 0.0;
        Double duesRaw = taxRepository.sumAmountByStatus(TaxStatus.PENDING);
        double totalPendingDues = duesRaw != null ? duesRaw : 0.0;

        long totalComplaints = complaintRepository.count();
        long submittedComplaints = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long underReviewComplaints = complaintRepository.countByStatus(ComplaintStatus.UNDER_REVIEW);
        long resolvedComplaints = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);

        long totalCertificateApplications = certificateRepository.count();
        long pendingCertificates = certificateRepository.countByStatus(CertificateStatus.PENDING);
        long underVerificationCertificates = certificateRepository
                .countByStatus(CertificateStatus.UNDER_VERIFICATION);
        long approvedCertificates = certificateRepository.countByStatus(CertificateStatus.APPROVED);
        long generatedCertificates = certificateRepository.countByStatus(CertificateStatus.GENERATED);
        long rejectedCertificates = certificateRepository.countByStatus(CertificateStatus.REJECTED);

        long totalPayments = paymentRepository.count();
        Double revenueRaw = paymentRepository.sumTotalRevenue();
        double totalRevenueCollected = revenueRaw != null ? revenueRaw : 0.0;

        List<ComplaintResponse> recentComplaints = complaintRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(c -> new ComplaintResponse(
                        c.getId(),
                        c.getAnonymous() ? null : c.getUser().getName(),
                        c.getDescription(), c.getImageUrl(),
                        c.getAnonymous(), c.getStatus(), c.getCreatedAt()))
                .collect(Collectors.toList());

        List<CertificateResponse> recentCertificateApplications = certificateRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "appliedDate")))
                .stream()
                .map(a -> new CertificateResponse(
                        a.getId(), a.getUser().getId(), a.getUser().getName(),
                        a.getCertificateType(), a.getDocumentUrl(), a.getStatus(),
                        a.getCertificateNumber(), a.getGeneratedCertificateUrl(),
                        a.getVerifiedBy() != null ? a.getVerifiedBy().getName() : null,
                        a.getVerifiedAt(), a.getVerificationRemarks(),
                        a.getApprovedBy() != null ? a.getApprovedBy().getName() : null,
                        a.getApprovedAt(), a.getApprovalRemarks(),
                        a.getRejectedAt(), a.getRejectionRemarks(),
                        a.getGeneratedAt(), a.getAppliedDate(), a.getUpdatedAt()))
                .collect(Collectors.toList());

        List<NotificationResponse> recentNotifications = notificationRepository
                .findAllByOrderByCreatedAtDesc()
                .stream().limit(5)
                .map(n -> new NotificationResponse(
                        n.getId(), n.getTitle(), n.getMessage(),
                        n.getTargetArea() == null ? "ALL" : n.getTargetArea(),
                        n.getType(), n.getCreatedAt()))
                .collect(Collectors.toList());

        return new AdminDashboardResponse(
                totalCitizens, totalWatermen,
                totalTaxRecords, pendingTaxCount, paidTaxCount,
                totalTaxCollection, totalPendingDues,
                totalComplaints, submittedComplaints,
                underReviewComplaints, resolvedComplaints,
                totalCertificateApplications, pendingCertificates,
                underVerificationCertificates, approvedCertificates,
                generatedCertificates, rejectedCertificates,
                totalPayments, totalRevenueCollected,
                recentComplaints, recentCertificateApplications,
                recentNotifications

        );

    }

}
