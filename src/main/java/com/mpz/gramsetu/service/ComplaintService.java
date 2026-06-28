package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.ComplaintRequest;
import com.mpz.gramsetu.dto.ComplaintResponse;
import com.mpz.gramsetu.dto.ComplaintStatusRequest;
import com.mpz.gramsetu.entity.Complaint;
import com.mpz.gramsetu.entity.ComplaintStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.ComplaintRepository;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintResponse submitComplaint(Long userId, ComplaintRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAnonymous = request.anonymous() != null && request.anonymous();

        Complaint complaint = Complaint.builder()
                .user(isAnonymous ? null : user)
                .description(request.description())
                .imageUrl(request.imageUrl())
                .anonymous(isAnonymous)
                .status(ComplaintStatus.SUBMITTED)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return toResponse(saved);

    }

    public List<ComplaintResponse>getMyComplaints(Long userId){
        return complaintRepository.findByUserId(userId).stream().map(c->toResponse(c)).collect(Collectors.toList());
    }

    public List<ComplaintResponse>getAllComplaints(){
        return complaintRepository.findAll().stream().map(c->toResponse(c)).collect(Collectors.toList());
    }

    public ComplaintResponse updateStatus(Long id,ComplaintStatusRequest request){
        Complaint complaint = complaintRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Complaint not found with id"+id));

        complaint.setStatus(request.status());
        Complaint updated= complaintRepository.save(complaint);
        return toResponse(updated);
    }


       private ComplaintResponse toResponse(Complaint complaint) {
        return new ComplaintResponse(
                complaint.getId(),
                complaint.getAnonymous() ? null : 
                    (complaint.getUser() != null ? complaint.getUser().getName() : null),
                complaint.getDescription(),
                complaint.getImageUrl(),
                complaint.getAnonymous(),
                complaint.getStatus(),
                complaint.getCreatedAt()
        );
    }

}
