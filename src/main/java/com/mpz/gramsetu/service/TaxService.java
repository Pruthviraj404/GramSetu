package com.mpz.gramsetu.service;

import com.mpz.gramsetu.dto.TaxRequest;
import com.mpz.gramsetu.dto.TaxResponse;
import com.mpz.gramsetu.entity.Tax;
import com.mpz.gramsetu.entity.TaxStatus;
import com.mpz.gramsetu.entity.User;
import com.mpz.gramsetu.exception.ResourceNotFoundException;
import com.mpz.gramsetu.repository.TaxRepository;
import com.mpz.gramsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class TaxService {

    private final TaxRepository taxRepository;
    private final UserRepository userRepository;

    public TaxResponse createTax(TaxRequest request){
        User user = userRepository.findById(request.userId()).orElseThrow(()-> new ResourceNotFoundException("User not found"));
        
        Tax tax = Tax.builder().user(user)
                .taxType(request.taxType()).amount(request.amount()).dueDate(request.duDate()).status(TaxStatus.PENDING).build();

         Tax savedTax  = taxRepository.save(tax);
         return toResponse(savedTax);  
         
        
    }
     public List<TaxResponse> getMyTaxes(Long userId){
            return taxRepository.findByUserId(userId).stream().map(tax -> toResponse(tax)).collect(Collectors.toList());
                
            
         }

       public List<TaxResponse> getMyTaxesByStatus(Long userId, TaxStatus status) {
        return taxRepository.findByUserIdAndStatus(userId, status)
                .stream()
                .map(tax -> toResponse(tax))
                .collect(Collectors.toList());
    }

     public TaxResponse updateTax(Long id,TaxStatus status){
        Tax tax = taxRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tax not found with id: " + id));
         tax.setStatus(status);
         Tax updatedTax= taxRepository.save(tax);
         return toResponse(updatedTax);
     }

     public List<TaxResponse>getAllTaxes(){
        return taxRepository.findAll().stream().map(tax -> toResponse(tax)).collect(Collectors.toList());

     }


     private TaxResponse toResponse(Tax tax){
        return new  TaxResponse(
            tax.getId(),
            tax.getUser().getId(),
                tax.getUser().getName(),
                tax.getTaxType(),
                tax.getAmount(),
                tax.getDueDate(),
                tax.getStatus(),
                tax.getCreatedAt()
        );
     }


     
     

}
