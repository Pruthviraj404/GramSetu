package com.mpz.gramsetu.repository;

import com.mpz.gramsetu.entity.WaterAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WaterAlertRepository extends JpaRepository<WaterAlert, Long> {

    // FR-24: citizens see alerts matching their area
    List<WaterAlert> findByAreaIgnoreCaseOrderByCreatedAtDesc(String area);

    List<WaterAlert> findAllByOrderByCreatedAtDesc();
}