package com.mpz.gramsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;


@Entity
@Table(name = "taxes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Tax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private TaxType taxType;

    private Double amount;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private TaxStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
}
