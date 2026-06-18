package com.is.a.Software.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.is.a.Software.entity.Subscription;
import com.is.a.Software.entity.User;
import com.is.a.Software.entity.Enum.Plan;
import com.is.a.Software.entity.Enum.SubscriptionStatus;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
	 Optional<Subscription> findTopByUserOrderByIdDesc(User user);
	    Optional<Subscription> findTopByUserAndStatusOrderByIdDesc(User user, SubscriptionStatus status);
	    List<Subscription> findByUserAndStatus(User user, SubscriptionStatus status);
	    
	    
	    Optional<Subscription> findByUserAndPlan(User user, Plan plan);
	    
	    	    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE' AND (s.end_date IS NULL OR s.end_date >= CURRENT_DATE)")
	    Optional<Subscription> findActiveSubscription(@Param("user") User user);

}