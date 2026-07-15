package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.TaxRequest;
import com.mpz.gramsetu.dto.TaxResponse;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.TaxService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/taxes")
@RequiredArgsConstructor
public class TaxController {

    private final TaxService taxService;

    private User getLoggedInUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }



    

    @PostMapping("/remind-pending")
    public ResponseEntity<?> triggerReminders(){

        if(taxService.isCurrentlyProcessing()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","Tax reminder execution is already  in progress."));

        }
        taxService.sendBulkTaxReminders();
        return ResponseEntity.ok(Map.of("Message","Tax reminders initiated asynchronously in backgound!"));

    }

    
    @GetMapping("/remind-status")
    public ResponseEntity<?>getReminderStatus(){
        return ResponseEntity.ok(Map.of("isProcessing",taxService.isCurrentlyProcessing()));
        
    }
    


   
    @GetMapping
    public ResponseEntity<List<TaxResponse>> getAllTaxes() {
        return ResponseEntity.ok(taxService.getAllTaxes());
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<TaxResponse> updateTax(
            @PathVariable Long id,
            @RequestParam TaxStatus status) {
        return ResponseEntity.ok(taxService.updateTax(id, status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaxResponse>> getMyTaxes() {
        User user = getLoggedInUser();
        return ResponseEntity.ok(taxService.getMyTaxes(user.getId()));
    }

    @GetMapping("/my/filter")
    public ResponseEntity<List<TaxResponse>> getMyTaxesByStatus(
            @RequestParam TaxStatus status) {
        User user = getLoggedInUser();
        return ResponseEntity.ok(taxService.getMyTaxesByStatus(user.getId(), status));
    }
}