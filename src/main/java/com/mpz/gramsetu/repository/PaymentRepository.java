package com.mpz.gramsetu.repository;
import com.mpz.gramsetu.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository  extends JpaRepository<Payment,Long>{
    List<Payment>findByUserId(Long userId);
    List<Payment>findByTaxId(Long taxId);


      long countByUserId(Long userId);
    //dashboard
    @Query("SELECT SUM(p.amount) FROM Payment p")
    Double sumTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user.id = :userId")
    Double sumAmountByUserId(@Param("userId") Long userId);

    
    
}
