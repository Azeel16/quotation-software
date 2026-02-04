package com.quotation.repository;

import com.quotation.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    Optional<Order> findLatestOrder();
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStatus(Order.OrderStatus status);
}
