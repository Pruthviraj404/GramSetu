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
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor

public class PaymentController {
    private final PaymentService paymentService;

    private User getLoggedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());
            String orderJson = paymentService.createRazorpayOrder(amount);
            return ResponseEntity.ok(orderJson);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Error", "Failed to initialize order:" + e.getMessage()));

        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<PaymentResponse>verifyAndSavePayment(@Valid @RequestBody PaymentRequest request){
        User user =getLoggedUser();
        PaymentResponse response = paymentService.verifyAndProcessPayment(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        User user = getLoggedUser();
        return ResponseEntity.ok(paymentService.getMyPayments(user.getId()));

    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

}
