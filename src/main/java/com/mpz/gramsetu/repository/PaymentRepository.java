package com.mpz.gramsetu.repository;
import com.mpz.gramsetu.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository  extends JpaRepository<Payment,Long>{
    List<Payment>findByUserId(Long userId);
    List<Payment>findByTaxId(Long taxId);

    
    
}
