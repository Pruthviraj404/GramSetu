package com.mpz.gramsetu.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.mpz.gramsetu.dto.NotificationType;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false , length = 1000)
    private String message;

    private String targetArea;

    @Enumerated(EnumType.STRING)
    private NotificationType  type;

    @CreationTimestamp
    private LocalDateTime createdAt;

    
}
