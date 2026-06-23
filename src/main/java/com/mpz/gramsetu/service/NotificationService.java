package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.NotificationRequest;
import com.mpz.gramsetu.dto.NotificationResponse;
import com.mpz.gramsetu.entity.Notification;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationResponse createNotification(NotificationRequest request) {
        String area = (request.targetArea() == null || request.targetArea().isBlank()
                || request.targetArea().equalsIgnoreCase("ALL")) ? null : request.targetArea();

        Notification notification = Notification.builder()
                .title(request.title()).message(request.message()).targetArea(area).type(request.type()).build();

        return toResponse(notificationRepository.save(notification));

    }

    public List<NotificationResponse> getMyNotifications(User user) {
         return notificationRepository
                .findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrderByCreatedAtDesc(user.getArea())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getAllNotification() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse)
                .collect(Collectors.toList());

    }

    public NotificationResponse getById(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id:" + id));
        return toResponse(n);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getTargetArea() == null ? "ALL" : n.getTargetArea(),
                n.getType(),
                n.getCreatedAt()

        );
    }

}
