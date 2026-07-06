package com.mpz.gramsetu.controller;


import com.mpz.gramsetu.dto.AdminDashboardResponse;
import com.mpz.gramsetu.dto.CitizenDashboardResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor

public class DashboardController {
    private final DashboardService dashboardService;

    private User getLoggedUser(){
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    }
    
    @GetMapping("/citizen")
    public ResponseEntity<CitizenDashboardResponse>getCitizenDashboard(){
        User user = getLoggedUser();

        return ResponseEntity.ok(dashboardService.getCitizenDashboard(user));
    }

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse>getAdminDashboard(){
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
        
    }

    
}
