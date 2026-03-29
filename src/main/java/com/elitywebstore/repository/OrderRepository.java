package com.elitywebstore.repository;

import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.STATUS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Existing methods
    @Query(value = "UPDATE Order o SET o.status=1 WHERE o.status=0")
    @Modifying
    Integer approveNewOrders();
    
    List<Order> findByUserId(Long userId);

    // New methods for Admin Order Management
    List<Order> findByStatus(STATUS status);
    
    List<Order> findAllByOrderByDateDesc();
    
    List<Order> findByStatusOrderByDateDesc(STATUS status);
}
