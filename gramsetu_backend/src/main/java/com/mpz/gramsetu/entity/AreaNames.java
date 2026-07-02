package com.mpz.gramsetu.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "area_names")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AreaNames {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "area_name",nullable = false,unique = true)
    private String areaName;

    
    
}
