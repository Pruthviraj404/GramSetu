package com.mpz.gramsetu.repository;


import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaxRepository extends JpaRepository<Tax,Long> {

    List<Tax>findByUserId(Long userId);

    List<Tax>findByUserIdAndStatus(Long userId,TaxStatus status);
    List<Tax>findByTaxType(com.mpz.gramsetu.entity.TaxType taxType);
    

    //dashboard queries
    long countByStatus(TaxStatus status);
    long countByUserIdAndStatus(Long userId,TaxStatus status);



     @Query("SELECT SUM(t.amount) FROM Tax t WHERE t.status = :status")
    Double sumAmountByStatus(@Param("status") TaxStatus status);
   



    @Query("SELECT SUM(t.amount) FROM Tax t WHERE t.user.id = :userId AND t.status = :status")
    Double sumAmountByUserIdAndStatus(@Param("userId") Long userId, @Param("status") TaxStatus status);
}

    

    
