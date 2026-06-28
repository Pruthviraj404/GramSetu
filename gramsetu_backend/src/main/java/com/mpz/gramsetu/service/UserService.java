package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.UserRequest;
import com.mpz.gramsetu.dto.UserResponse;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;

    public UserResponse createUser(UserRequest request){
        if(userRepository.existsByMobileNumber(request.mobileNumber())){
            throw new IllegalArgumentException("Mobile number already registered");

        }
        User user = User.builder()
                .name(request.name())
                .mobileNumber(request.mobileNumber())
                .role(request.role())
                .houseNumber(request.houseNumber())
                .area(request.area())
                .address(request.address())
                .build();


        return toResponse(userRepository.save(user));      
    }


    public UserResponse updateUser(Long id, UserRequest request){
        User user= userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User Not found"));
        

        user.setName(request.name());
        user.setMobileNumber(request.mobileNumber());
        user.setAddress(request.address());
        user.setRole(request.role());
        user.setArea(request.area());
        user.setHouseNumber(request.houseNumber());

        return toResponse(userRepository.save(user));
    }


    public List<UserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }


    public UserResponse getUserById(Long id){
        User user= userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found"));
        return toResponse(user);
       
    }


    public void deleteUser(Long id) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    userRepository.delete(user);
}

    public List<UserResponse> searchUsers(String name, String mobile, String houseNumber){
        if(name!=null && !name.isBlank()){
            return userRepository.findByNameContainingIgnoreCase(name).stream().map(this::toResponse).collect(Collectors.toList());
        }
        if(mobile !=null && !mobile.isBlank()){
            return userRepository.findByMobileNumberContaining(mobile).stream().map(this::toResponse).collect(Collectors.toList());
        }
        if (houseNumber != null && !houseNumber.isBlank()) {
            return userRepository.findByHouseNumberContainingIgnoreCase(houseNumber)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        }

        return getAllUsers();
        
    }






     private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getMobileNumber(),
                user.getRole(),
                user.getHouseNumber(),
                user.getArea(),
                user.getAddress(),
                user.getCreatedAt()
        );
    }

}
