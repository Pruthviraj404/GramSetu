package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.CertificateRemarksRequest;
import com.mpz.gramsetu.dto.CertificateRequest;
import com.mpz.gramsetu.dto.CertificateResponse;
import com.mpz.gramsetu.entity.CertificateApplication;
import com.mpz.gramsetu.entity.CertificateStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.InvalidStatusTransitionException;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.CertificateRepository;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.StandardOpenOption;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;

@Service
@RequiredArgsConstructor

public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CertificateNumberGenerator numberGenerator;
    private final CertificatePdfGenerator pdfGenerator;

    private static final String STORAGE_DIR = "uploads/certificates";

    public CertificateResponse applyCertificate(Long userId, CertificateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        CertificateApplication application = CertificateApplication.builder()
                .user(user).certificateType(request.certificateType()).documentUrl(request.documentUrl())
                .status(CertificateStatus.PENDING).build();

        return toResponse(certificateRepository.save(application));
    }

    public List<CertificateResponse> getMyApplications(Long userId) {
        return certificateRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());

    }

    public CertificateResponse getMyApplicationById(Long userId, Long id) {
        CertificateApplication app = certificateRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(app);
    }

    public byte[] downloadCertificate(Long userId, Long id) {
        CertificateApplication app = certificateRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (app.getStatus() != CertificateStatus.GENERATED) {
            throw new InvalidStatusTransitionException(
                    "Certificate is not yet generated. Current status: " + app.getStatus());
        }

        try {
            return Files.readAllBytes(Paths.get(app.getGeneratedCertificateUrl()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read certificate file: " + e.getMessage());
        }
    }

    public List<CertificateResponse> getAllApplications() {
        return certificateRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CertificateResponse getApplicationById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public CertificateResponse verifyApplication(Long id, Long adminId, CertificateRemarksRequest request){
        CertificateApplication app= findOrThrow(id);
        if(app.getStatus()!=CertificateStatus.PENDING){
            throw new InvalidStatusTransitionException("Only PENDING applications can move to UNDER_VERIFICATION. Current status: " + app.getStatus());
        }

        User admin = userRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        app.setStatus(CertificateStatus.UNDER_VERIFICATION);
        app.setVerifiedBy(admin);
        app.setVerifiedAt(LocalDateTime.now());
        app.setVerificationRemarks(request.remarks());

        return toResponse(certificateRepository.save(app));

    }

    public CertificateResponse approveApplication(Long id, Long adminId,CertificateRemarksRequest request){
        CertificateApplication app= findOrThrow(id);

        if(app.getStatus()!=CertificateStatus.UNDER_VERIFICATION){
            throw new InvalidStatusTransitionException("Only UNDER_VERIFICATION applications can be APPROVED. Current status: " + app.getStatus());

        }

        User admin = userRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        String certNumber = numberGenerator.generate(app.getCertificateType());

        app.setStatus(CertificateStatus.APPROVED);
        app.setApprovedBy(admin);
        app.setApprovedAt(LocalDateTime.now());
        app.setApprovalRemarks(request.remarks());
        app.setCertificateNumber(certNumber);
        
        return toResponse(certificateRepository.save(app));
    }

    public CertificateResponse rejectApplication(Long id, CertificateRemarksRequest request){
        CertificateApplication app = findOrThrow(id);

        if(app.getStatus()!=CertificateStatus.UNDER_VERIFICATION){
            throw new InvalidStatusTransitionException("Only UNDER_VERIFICATION applications can be REJECTED. Current status: " + app.getStatus());

        }

        app.setStatus(CertificateStatus.REJECTED);
        app.setRejectedAt(LocalDateTime.now());
        app.setRejectionRemarks(request.remarks());

        return toResponse(certificateRepository.save(app));


    }

    public CertificateResponse generateCertificate(Long id){
        CertificateApplication app= findOrThrow(id);

        if(app.getStatus()!=CertificateStatus.APPROVED){
             throw new InvalidStatusTransitionException(
                    "Only APPROVED applications can be GENERATED. Current status: " + app.getStatus());
        }
 
        app.setGeneratedAt(LocalDateTime.now());


        byte[] pdfBytes = pdfGenerator.generate(app);

        String fileName= app.getCertificateNumber()+".pdf";
        String filePath = saveToDisk(fileName,pdfBytes);

        app.setGeneratedCertificateUrl(filePath);
        app.setStatus(CertificateStatus.GENERATED);

        return toResponse(certificateRepository.save(app));

    }

    private String saveToDisk(String fileName , byte[] data){
        try{
            Path dir= Paths.get(STORAGE_DIR);
            if(!Files.exists(dir)){
                Files.createDirectories(dir);
            }
            Path filePath= dir.resolve(fileName);

              Files.write(
                filePath,
                data,
                StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING
        );

            return filePath.toString();
        }catch (IOException e) {

        throw new RuntimeException(
                "Failed to save certificate PDF",
                e
        );
    }
    }





    private CertificateApplication findOrThrow(Long id) {
        return certificateRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                "Certificate application not found with id: " + id));

    }




    private CertificateResponse toResponse(CertificateApplication app) {

        return new CertificateResponse(
                app.getId(),
                app.getUser() != null ? app.getUser().getId() : null,
                app.getUser() != null ? app.getUser().getName() : null,

                app.getCertificateType(),
                app.getDocumentUrl(),
                app.getStatus(),
                app.getCertificateNumber(),
                app.getGeneratedCertificateUrl(),

                app.getVerifiedBy() != null ? app.getVerifiedBy().getName() : null,
                app.getVerifiedAt(),
                app.getVerificationRemarks(),

                app.getApprovedBy() != null ? app.getApprovedBy().getName() : null,
                app.getApprovedAt(),
                app.getApprovalRemarks(),

                app.getRejectedAt(),
                app.getRejectionRemarks(),

                app.getGeneratedAt(),
                app.getAppliedDate(),
                app.getUpdatedAt());
    }

}
