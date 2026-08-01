package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    // GET ORDERS OF PARTICULAR USER
    List<Order> findByUserId(Long userId);

    // GET ORDERS BY USER + STATUS
    List<Order> findByUserIdAndStatus(
            Long userId,
            String status
    );

    // FIND ORDER CONTAINING ITEM
    Order findByItems_Id(Long itemId);

    default List<Order> getValidOrders(List<Order> orders) {
        if (orders == null) {
            return java.util.Collections.emptyList();
        }
        return orders.stream()
                .filter(order -> order.getStatus() != null)
                .filter(order -> !order.getStatus().equalsIgnoreCase("Cancelled"))
                .toList();
    }

    default List<Order> findValidByUserId(Long userId) {
        return getValidOrders(findByUserId(userId));
    }
}