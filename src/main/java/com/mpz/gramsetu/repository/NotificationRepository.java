package com.mpz.gramsetu.repository;
import com.mpz.gramsetu.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface NotificationRepository  extends JpaRepository<Notification,Long>{


  List<Notification> findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrTargetAreaIgnoreCase(
            String allKeyword, String userArea);

   
    List<Notification> findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrderByCreatedAtDesc(String area);
    
    List<Notification>findAllByOrderByCreatedAtDesc();
    
}
