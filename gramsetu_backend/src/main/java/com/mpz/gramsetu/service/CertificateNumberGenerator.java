package com.mpz.gramsetu.service;
import com.mpz.gramsetu.entity.CertificateType;
import com.mpz.gramsetu.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.Year;


@Component
@RequiredArgsConstructor

public class CertificateNumberGenerator {

    private final CertificateRepository certificateRepository;

    private static final java.util.Map<CertificateType, String> PREFIX_MAP = java.util.Map.of(
            CertificateType.RESIDENCE, "RES",
            CertificateType.INCOME, "INC",
            CertificateType.BIRTH, "BIR",
            CertificateType.DEATH, "DTH"
    );

    // Generates e.g. RES-2026-0001
    public String generate(CertificateType type) {
        int year = Year.now().getValue();
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        long countThisYear = certificateRepository
                .countByCertificateTypeAndAppliedDateBetween(type, start, end);

        long nextSeq = countThisYear + 1;
        String prefix = PREFIX_MAP.getOrDefault(type, "CERT");

        return String.format("%s-%d-%04d", prefix, year, nextSeq);
    }
    
}
