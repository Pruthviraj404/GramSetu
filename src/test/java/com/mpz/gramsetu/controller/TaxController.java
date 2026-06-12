package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.TaxRequest;
import com.mpz.gramsetu.dto.TaxResponse;
import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.TaxService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taxes")
@RequiredArgsConstructor

public class TaxController {

    private final TaxService taxService;

    @PostMapping
    public ResponseEntity<TaxResponse>createTax(@Valid @RequestBody TaxRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(taxService.createTax(request));

    }

    @GetMapping
    public ResponseEntity<List<TaxResponse>>getAllTaxes(){
        return ResponseEntity.ok(taxService.getAllTaxes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxResponse>updateTax(@PathVariable Long id , @RequestParam TaxStatus status){
      return ResponseEntity.ok(taxService.updateTax(id, status));

    }
    


    @GetMapping("/my")
    public ResponseEntity<List<TaxResponse>>getMyTaxes(@AuthenticationPrincipal User user , @RequestParam TaxStatus status){
        return ResponseEntity.ok(taxService.getMyTaxes(user.getId()));

    }
    @GetMapping("/my/filter")
    public ResponseEntity<List<TaxResponse>>getMyTaxesByStatus(@AuthenticationPrincipal User user, @RequestParam TaxStatus status){
        return ResponseEntity.ok(taxService.getMyTaxesByStatus(user.getId(), status));
    }



    
    
}
