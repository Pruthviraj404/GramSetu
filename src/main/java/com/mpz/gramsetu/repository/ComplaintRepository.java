package com.mpz.gramsetu.repository;
import com.mpz.gramsetu.entity.Complaint;
import com.mpz.gramsetu.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository  extends JpaRepository<Complaint,Long>{
    List<Complaint>findByUserId(Long userId);
    List<Complaint>findByStatus(ComplaintStatus status);
    

    //dashboard
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ComplaintStatus status);
    long countByStatus(ComplaintStatus status);
}
