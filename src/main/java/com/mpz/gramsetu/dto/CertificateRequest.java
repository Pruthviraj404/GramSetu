package com.mpz.gramsetu.dto;
import com.mpz.gramsetu.entity.CertificateType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record CertificateRequest (


    @NotNull(message = "Certificate type is required")
    CertificateType certificateType,

    @NotBlank(message = "Document URL is required")
    String documentUrl


){}