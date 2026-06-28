package com.mpz.gramsetu.repository;

import com.mpz.gramsetu.entity.CertificateApplication;
import com.mpz.gramsetu.entity.CertificateType;
import com.mpz.gramsetu.entity.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface CertificateRepository  extends JpaRepository<CertificateApplication,Long>{


    List<CertificateApplication>findByUserId(Long userId);

    Optional<CertificateApplication>findByIdAndUserId(Long id,Long userId);

    long countByCertificateTypeAndAppliedDateBetween(
            CertificateType type, java.time.LocalDateTime start, java.time.LocalDateTime end);
 
            
     //Dashboard
     long countByStatus(CertificateStatus status);
     long countByUserIdAndStatus(Long userId, CertificateStatus status);
     long countByUserId(Long userId);
            
}
