package com.elitywebstore.repository;

import com.elitywebstore.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(value = "UPDATE Order o SET o.status=1 WHERE o.status=0")
    @Modifying
    Integer approveNewOrders();

}
