package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.WaterAlertRequest;
import com.mpz.gramsetu.dto.WaterAlertResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.WaterAlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/water-alerts")
@RequiredArgsConstructor
public class WaterAlertController {

    private final WaterAlertService waterAlertService;

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // FR-23: Waterman creates area-based alert
    @PostMapping
    public ResponseEntity<WaterAlertResponse> createAlert(
            @Valid @RequestBody WaterAlertRequest request) {
        User waterman = getLoggedInUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(waterAlertService.createAlert(waterman, request));
    }

    // FR-24: Citizen views alerts for their own area
    @GetMapping("/my")
    public ResponseEntity<List<WaterAlertResponse>> getMyAreaAlerts() {
        User citizen = getLoggedInUser();
        
        return ResponseEntity.ok(waterAlertService.getMyAreaAlerts(citizen));
    }

    // Waterman/Admin: view all alerts ever sent
    @GetMapping
    public ResponseEntity<List<WaterAlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(waterAlertService.getAllAlerts());
    }

    // View single alert
    @GetMapping("/{id}")
    public ResponseEntity<WaterAlertResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(waterAlertService.getById(id));
    }
}