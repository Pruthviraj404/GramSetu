package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.CertificateRemarksRequest;
import com.mpz.gramsetu.dto.CertificateRequest;
import com.mpz.gramsetu.dto.CertificateResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<CertificateResponse> applyCertificate(@Valid @RequestBody CertificateRequest request) {
        User user = getLoggedInUser();

    //     System.out.println("Certificate API Hit");

    // System.out.println(
    //     SecurityContextHolder.getContext()
    //             .getAuthentication()
    // );


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificateService.applyCertificate(user.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CertificateResponse>> getMyApplications() {
        User user = getLoggedInUser();

        return ResponseEntity.ok(certificateService.getMyApplications(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getMyApplicationById(@PathVariable Long id) {
        User user = getLoggedInUser();

        return ResponseEntity.ok(certificateService.getApplicationById(id));

    }

     @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long id) {
        User user = getLoggedInUser();
        byte[] pdf = certificateService.downloadCertificate(user.getId(), id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .body(pdf);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<CertificateResponse>>getAllApplications(){
        return ResponseEntity.ok(certificateService.getAllApplications());

    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<CertificateResponse>verify(@PathVariable Long id , @RequestBody(required= false) CertificateRemarksRequest request){
        User admin = getLoggedInUser();

        CertificateRemarksRequest req= request!=null  ? request : new CertificateRemarksRequest(null);
         return ResponseEntity.ok(certificateService.verifyApplication(id, admin.getId(), req));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<CertificateResponse>approve(@PathVariable Long id, @RequestBody(required =false) CertificateRemarksRequest request){
        User admin = getLoggedInUser();

        CertificateRemarksRequest req;
        if(request != null){
            req = request;
        }else{
            req =  new CertificateRemarksRequest(null);
        }

        return ResponseEntity.ok(certificateService.approveApplication(id, admin.getId(), req));

    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<CertificateResponse>reject(@PathVariable Long id, @RequestBody(required=false) CertificateRemarksRequest request){
        User admin = getLoggedInUser();
         CertificateRemarksRequest req;
        if(request != null){
            req = request;
        }else{
            req =  new CertificateRemarksRequest(null);
        }

       return ResponseEntity.ok(certificateService.rejectApplication(id,req));

    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<CertificateResponse>generate(@PathVariable Long id){
        return ResponseEntity.ok(certificateService.generateCertificate(id));
    }

}
