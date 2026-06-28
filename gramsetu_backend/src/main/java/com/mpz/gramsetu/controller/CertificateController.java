package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.CertificateRemarksRequest;
import com.mpz.gramsetu.dto.CertificateRequest;
import com.mpz.gramsetu.dto.CertificateResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    private static final String UPLOAD_DIRECTORY = "uploads/supporting-docs/";

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // ===== File Upload =====
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select a valid file"));
        }  // ← closing brace was missing here before

        try {
            Path uploadPath = Paths.get(UPLOAD_DIRECTORY);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String uniqueFilename = UUID.randomUUID().toString()
                    + "_" + file.getOriginalFilename();
            Path targetPath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath);

            String savedDocumentUrl =
                    "http://localhost:8081/api/certificates/view-file/" + uniqueFilename;

            return ResponseEntity.ok(Map.of("documentUrl", savedDocumentUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }

    // ===== View Uploaded File =====
    @GetMapping("/view-file/{filename:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIRECTORY).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===== Citizen: Apply =====
    @PostMapping
    public ResponseEntity<CertificateResponse> applyCertificate(
            @Valid @RequestBody CertificateRequest request) {
        User user = getLoggedInUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificateService.applyCertificate(user.getId(), request));
    }

    // ===== Citizen: My Applications =====
    @GetMapping("/my")
    public ResponseEntity<List<CertificateResponse>> getMyApplications() {
        User user = getLoggedInUser();
        return ResponseEntity.ok(certificateService.getMyApplications(user.getId()));
    }

    // ===== Citizen: Single Application =====
    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getMyApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getApplicationById(id));
    }

    // ===== Citizen: Download Certificate =====
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id) {
        User user = getLoggedInUser();
        byte[] pdf = certificateService.downloadCertificate(user.getId(), id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate.pdf")
                .body(pdf);
    }

    // ===== Admin: All Applications =====
    @GetMapping("/admin/all")
    public ResponseEntity<List<CertificateResponse>> getAllApplications() {
        return ResponseEntity.ok(certificateService.getAllApplications());
    }

    // ===== Admin: Verify (PENDING → UNDER_VERIFICATION) =====
    @PutMapping("/{id}/verify")
    public ResponseEntity<CertificateResponse> verify(
            @PathVariable Long id,
            @RequestBody(required = false) CertificateRemarksRequest request) {
        User admin = getLoggedInUser();
        CertificateRemarksRequest req = request != null
                ? request : new CertificateRemarksRequest(null);
        return ResponseEntity.ok(
                certificateService.verifyApplication(id, admin.getId(), req));
    }

    // ===== Admin: Approve (UNDER_VERIFICATION → APPROVED) =====
    @PutMapping("/{id}/approve")
    public ResponseEntity<CertificateResponse> approve(
            @PathVariable Long id,
            @RequestBody(required = false) CertificateRemarksRequest request) {
        User admin = getLoggedInUser();
        CertificateRemarksRequest req = request != null
                ? request : new CertificateRemarksRequest(null);
        return ResponseEntity.ok(
                certificateService.approveApplication(id, admin.getId(), req));
    }

    // ===== Admin: Reject (UNDER_VERIFICATION → REJECTED) =====
    @PutMapping("/{id}/reject")
    public ResponseEntity<CertificateResponse> reject(
            @PathVariable Long id,
            @RequestBody(required = false) CertificateRemarksRequest request) {
        CertificateRemarksRequest req = request != null
                ? request : new CertificateRemarksRequest(null);
        return ResponseEntity.ok(certificateService.rejectApplication(id, req));
    }

    // ===== Admin: Generate PDF (APPROVED → GENERATED) =====
    @PostMapping("/{id}/generate")
    public ResponseEntity<CertificateResponse> generate(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.generateCertificate(id));
    }
}