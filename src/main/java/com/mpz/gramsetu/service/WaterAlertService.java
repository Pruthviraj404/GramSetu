package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.WaterAlertRequest;
import com.mpz.gramsetu.dto.WaterAlertResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.entity.WaterAlert;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.WaterAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WaterAlertService {

    private final WaterAlertRepository waterAlertRepository;

    // FR-23: Waterman selects area and creates alert
    public WaterAlertResponse createAlert(User waterman, WaterAlertRequest request) {
        WaterAlert alert = WaterAlert.builder()
                .createdBy(waterman)
                .area(request.area())
                .message(request.message())
                .build();

        return toResponse(waterAlertRepository.save(alert));
    }

    // FR-24: Citizens in the selected area receive alerts
    public List<WaterAlertResponse> getMyAreaAlerts(User citizen) {
        return waterAlertRepository.findByAreaIgnoreCaseOrderByCreatedAtDesc(citizen.getArea())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Admin / Waterman: view all alerts sent
    public List<WaterAlertResponse> getAllAlerts() {
        return waterAlertRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WaterAlertResponse getById(Long id) {
        WaterAlert alert = waterAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Water alert not found with id: " + id));
        return toResponse(alert);
    }

    private WaterAlertResponse toResponse(WaterAlert alert) {
        return new WaterAlertResponse(
                alert.getId(),
                alert.getCreatedBy().getName(),
                alert.getArea(),
                alert.getMessage(),
                alert.getCreatedAt()
        );
    }
}