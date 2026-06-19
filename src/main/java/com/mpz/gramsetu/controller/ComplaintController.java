package com.mpz.gramsetu.controller;


import com.mpz.gramsetu.dto.ComplaintRequest;
import com.mpz.gramsetu.dto.ComplaintResponse;
import com.mpz.gramsetu.dto.ComplaintStatusRequest;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor

public class ComplaintController {

    private final ComplaintService complaintService;

    private User getLoggedInUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<ComplaintResponse>submitComplaint(@Valid @RequestBody ComplaintRequest request){
        User user= getLoggedInUser();

        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.submitComplaint(user.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>>getMyComplaints(){
        User user = getLoggedInUser();
        return ResponseEntity.ok(complaintService.getMyComplaints(user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>>getAllComplaints(){
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplaintResponse>updateStatus(@PathVariable Long id,  @Valid @RequestBody ComplaintStatusRequest request){
        return ResponseEntity.ok(complaintService.updateStatus(id, request));
    }


    
}
