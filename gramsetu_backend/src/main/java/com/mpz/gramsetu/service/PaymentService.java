package com.mpz.gramsetu.service;
import com.mpz.gramsetu.dto.PaymentRequest;
import com.mpz.gramsetu.dto.PaymentResponse;
import com.mpz.gramsetu.entity.Payment;
import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.PaymentRepository;
import com.mpz.gramsetu.repository.TaxRepository;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TaxRepository taxRepository;
    private final UserRepository userRepository;

    public PaymentResponse payTax(Long userId, PaymentRequest request){
        User user= userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User not found"));

        Tax tax= taxRepository.findById(request.taxId()).orElseThrow(()-> new ResourceNotFoundException("Tax not found"));

        if(!tax.getUser().getId().equals(userId)){
            throw new IllegalArgumentException("This tax does not belongs to you.");

        }

        Payment payment= Payment.builder()
        .user(user).tax(tax).amount(request.amount()).transactionId(request.transcationId()).build();

        Payment savedPayment = paymentRepository.save(payment);

        tax.setStatus(TaxStatus.PAID);
        taxRepository.save(tax);

        return toResponse(savedPayment);
    }

    public List<PaymentResponse>getMyPayments(Long userId){
        return paymentRepository.findByUserId(userId).stream().map(payment -> toResponse(payment))
                .collect(Collectors.toList());
    }

    public List<PaymentResponse>getAllPayments(){
        return paymentRepository.findAll().stream().map(payment->toResponse(payment)).collect(Collectors.toList());
        
    }
    

     private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getUser().getId(),
                payment.getUser().getName(),
                payment.getTax().getId(),
                payment.getTax().getTaxType().name(),
                payment.getAmount(),
                payment.getTransactionId(),
                payment.getPaymentDate()
        );
    }
}
