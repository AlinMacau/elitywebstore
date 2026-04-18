package com.elitywebstore.repository;

import com.elitywebstore.entities.Order;
import com.elitywebstore.entities.STATUS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

 List<Order> findByUserId(Long userId);

 List<Order> findByStatus(STATUS status);

 List<Order> findAllByOrderByDateDesc();

 @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o WHERE o.shippingAddress.id = :addressId OR o.billingAddress.id = :addressId")
 boolean existsByShippingAddressIdOrBillingAddressId(@Param("addressId") Long addressId);

 @Query("SELECT COUNT(o) FROM Order o WHERE o.shippingAddress.id = :addressId OR o.billingAddress.id = :addressId")
 long countByAddressId(@Param("addressId") Long addressId);

 // ==================== NEW: Fetch Join Queries ====================

 @Query("SELECT DISTINCT o FROM Order o " +
        "LEFT JOIN FETCH o.orderItems oi " +
        "LEFT JOIN FETCH oi.product " +
        "LEFT JOIN FETCH o.shippingAddress " +
        "LEFT JOIN FETCH o.billingAddress " +
        "LEFT JOIN FETCH o.user u " +
        "LEFT JOIN FETCH u.details " +
        "WHERE o.id = :id")
 Optional<Order> findByIdWithDetails(@Param("id") Long id);

 @Query("SELECT DISTINCT o FROM Order o " +
        "LEFT JOIN FETCH o.orderItems oi " +
        "LEFT JOIN FETCH oi.product " +
        "LEFT JOIN FETCH o.shippingAddress " +
        "LEFT JOIN FETCH o.billingAddress " +
        "WHERE o.user.id = :userId " +
        "ORDER BY o.date DESC")
 List<Order> findByUserIdWithDetails(@Param("userId") Long userId);
}
