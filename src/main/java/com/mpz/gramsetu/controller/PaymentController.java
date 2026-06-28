package com.mpz.gramsetu.controller;
import com.mpz.gramsetu.dto.PaymentRequest;
import com.mpz.gramsetu.dto.PaymentResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor

public class PaymentController {
    private final PaymentService paymentService;

    private User getLoggedUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<PaymentResponse>payTax(@Valid @RequestBody PaymentRequest request){
        User user=getLoggedUser();

        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.payTax(user.getId(), request));

    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>>getMyPayments(){
        User user = getLoggedUser();
        return ResponseEntity.ok(paymentService.getMyPayments(user.getId()));

    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>>getAllPayments(){
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
}
