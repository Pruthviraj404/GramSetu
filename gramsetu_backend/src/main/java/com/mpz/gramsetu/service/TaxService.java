package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.TaxRequest;
import com.mpz.gramsetu.dto.TaxResponse;
import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.TaxType;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.TaxRepository;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class TaxService {

   private final TaxRepository taxRepository;
   private final UserRepository userRepository;
   private final NotificationMailingService mailingService;

   private final AtomicBoolean isProcessingReminders = new AtomicBoolean(false);

   public boolean isCurrentlyProcessing() {
      return isProcessingReminders.get();
   }

   @Async
   @org.springframework.transaction.annotation.Transactional(readOnly = true)
   public void sendBulkTaxReminders() {

      if(!isProcessingReminders.compareAndSet(false, true)){
         return ;
      }
      try{
      List<Tax> pendingTaxes = taxRepository.findPendingTaxesWithUsers();
      if(pendingTaxes==null || pendingTaxes.isEmpty()){
         return;
      }

      for (Tax tax : pendingTaxes) {
         if (tax.getUser() != null && tax.getUser().getEmail() != null && !tax.getUser().getEmail().isBlank()) {

            String customMessage = "Your tax details are as follows:\n" +
                  "Tax Type:" + tax.getTaxType() + "\n" +
                  "Pending Amount: ₹" + tax.getAmount() + "\n" +
                  "Due Date: " + tax.getDueDate() + "\n\n" +
                  "Please log in to the GramSetu portal and clear your dues via Razorpay.";

                  mailingService.sendEmailAlert(tax.getUser().getEmail(), "Pending Tax Reminder Alert!", customMessage, "TAX_REMINDER");

         }
      }
   }finally{

      isProcessingReminders.set(false);
   }
      
   }

   @Scheduled(cron = "0 0 0 1 * * ")

   public void autoGenerateMonthlyTaxes() {
      System.out.println("Initiating Automated Monthly Tax Generation Cron Job...");

      LocalDate standardDueDate = LocalDate.now().plusDays(30);

      List<User> citizens = userRepository.findAll().stream()
            .filter(user -> user.getRole() != null && user.getRole().toString().equals(("CITIZEN")))
            .collect(Collectors.toList());

      for (User citizen : citizens) {
         generateTaxIfNotExist(citizen, "GHARPATTI", 700.0, standardDueDate);
         generateTaxIfNotExist(citizen, "PANIPATTI", 500.0, standardDueDate);

      }
   }

   private void generateTaxIfNotExist(User citizen, String taxType, Double amount, LocalDate dueDate) {
      boolean alreadyBilled = taxRepository.findByUserId(citizen.getId()).stream()
            .anyMatch(t -> t.getTaxType() != null
                  && t.getTaxType().name().equalsIgnoreCase(taxType)
                  && t.getDueDate() != null
                  && t.getDueDate().getMonth() == dueDate.getMonth()
                  && t.getDueDate().getYear() == dueDate.getYear());

      if (!alreadyBilled) {
         Tax tax = Tax.builder()
               .user(citizen)
               .taxType(TaxType.valueOf(taxType.toUpperCase()))
               .amount(amount)
               .dueDate(dueDate)
               .status(TaxStatus.PENDING)
               .build();

         taxRepository.save(tax);
      }

   }

   public List<TaxResponse> getMyTaxes(Long userId) {
      return taxRepository.findByUserId(userId).stream().map(tax -> toResponse(tax)).collect(Collectors.toList());

   }

   public List<TaxResponse> getMyTaxesByStatus(Long userId, TaxStatus status) {
      return taxRepository.findByUserIdAndStatus(userId, status)
            .stream()
            .map(tax -> toResponse(tax))
            .collect(Collectors.toList());
   }

   public TaxResponse updateTax(Long id, TaxStatus status) {
      Tax tax = taxRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));
      tax.setStatus(status);
      Tax updatedTax = taxRepository.save(tax);
      return toResponse(updatedTax);
   }

   public List<TaxResponse> getAllTaxes() {
      return taxRepository.findAll().stream().map(tax -> toResponse(tax)).collect(Collectors.toList());

   }

   private TaxResponse toResponse(Tax tax) {
      return new TaxResponse(
            tax.getId(),
            tax.getUser().getId(),
            tax.getUser().getName(),
            tax.getTaxType(),
            tax.getAmount(),
            tax.getDueDate(),
            tax.getStatus(),
            tax.getCreatedAt());
   }

}
