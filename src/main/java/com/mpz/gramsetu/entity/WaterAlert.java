package com.mpz.gramsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false, length = 1000)
    private String message;

    @CreationTimestamp
    private LocalDateTime createdAt;
}