package com.mpz.gramsetu.controller;

import com.mpz.gramsetu.dto.NotificationRequest;
import com.mpz.gramsetu.dto.NotificationResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor

public class NotificationController {

    private final NotificationService notificationService;

    private User getLoggedUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<NotificationResponse>createNotification(@Valid @RequestBody NotificationRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>>getMyNotifications(){
        User user =getLoggedUser();

        return ResponseEntity.ok(notificationService.getMyNotifications(user));

    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<NotificationResponse>>getALLNotifications(){
        return ResponseEntity.ok(notificationService.getAllNotification());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse>getById(@PathVariable Long id){
        return ResponseEntity.ok(notificationService.getById(id));
    }
    
    
}
