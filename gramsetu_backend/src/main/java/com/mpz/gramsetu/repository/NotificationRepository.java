package com.mpz.gramsetu.repository;
import com.mpz.gramsetu.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;


public interface NotificationRepository  extends JpaRepository<Notification,Long>{


  List<Notification> findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrTargetAreaIgnoreCase(
            String allKeyword, String userArea);

   
    List<Notification> findByTargetAreaIsNullOrTargetAreaIgnoreCaseOrderByCreatedAtDesc(String area);
    
    @Query("SELECT n FROM Notification n ORDER BY n.createdAt desc")
    List<Notification>findAllByOrderByCreatedAtDesc();
    
}
