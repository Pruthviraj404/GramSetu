package com.mpz.gramsetu.repository;

import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;



public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User>findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
    List<User> findByNameContainingIgnoreCase (String name);
    List<User> findByMobileNumberContaining(String mobileNumber);
    List<User>findByHouseNumberContainingIgnoreCase(String houseNumber);
  
    
    
    long countByRole(Role role);
} 
