package com.mpz.gramsetu.repository;


import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaxRepository extends JpaRepository<Tax,Long> {

    List<Tax>findByUserId(Long userId);

    List<Tax>findByUserIdAndStatus(Long userId,TaxStatus status);
    List<Tax>findByTaxType(com.mpz.gramsetu.entity.TaxType taxType);
    

    
}

    
