package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import com.ecommerce.backend.entity.Notification;
import com.ecommerce.backend.repository.NotificationRepository;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.repository.ProductRepository;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationRepository
            notificationRepository;

    // GET ALL ORDERS
    @GetMapping
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    // CREATE ORDER
    @PostMapping
    public Order createOrder(
            @RequestBody Order order) {

        order.setDate(
                new SimpleDateFormat("yyyy-MM-dd")
                        .format(new Date()));
        java.time.LocalDate estimatedDate =
                java.time.LocalDate.now()
                        .plusDays(5);

        order.setEstimatedDeliveryDate(
                estimatedDate.toString()
        );

        if(order.getStatus() == null
                || order.getStatus().isEmpty()) {

            order.setStatus(
                    "Preparing Your Order");
        }

        // CHECK STOCK

        for(OrderItem item :
                order.getItems()) {

            Product product =
                    productRepository.findById(
                            item.getProductId()
                    ).orElseThrow(
                            () -> new RuntimeException(
                                    "Product not found"
                            )
                    );

            if(product.getStockQuantity()
                    < item.getQuantity()) {

                throw new RuntimeException(
                        "Only "
                                + product.getStockQuantity()
                                + " item(s) available for "
                                + product.getName()
                );
            }
        }

        // REDUCE STOCK + INCREASE SALES COUNT

        for(OrderItem item :
                order.getItems()) {

            Product product =
                    productRepository.findById(
                            item.getProductId()
                    ).orElse(null);

            if(product != null) {

                // Reduce inventory

                product.setStockQuantity(

                        product.getStockQuantity()
                                - item.getQuantity()

                );

                // Increase sales count

                product.setSalesCount(

                        product.getSalesCount()
                                + item.getQuantity()

                );

                productRepository.save(product);
            }
        }

        Order savedOrder =
                orderRepository.save(order);

        createNotification(

                savedOrder.getUserId(),

                "Order Placed",

                "Order #" +
                        savedOrder.getId() +
                        " placed successfully."

        );

        for(OrderItem item : order.getItems()) {

            if(item.getStatus() == null
                    || item.getStatus().isBlank()) {

                item.setStatus(
                        "Ordered"
                );
            }
        }

        return savedOrder;
    }

    // GET USER ORDERS
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(
            @PathVariable Long userId
    ) {

        List<Order> orders =
                orderRepository.findValidByUserId(userId);

        for(Order order : orders) {

            if(order.getStatus() == null
                    || order.getStatus().isBlank()) {

                order.setStatus(
                        "Preparing Your Order"
                );
            }

            if(order.getTimelineStatus() == null
                    || order.getTimelineStatus().isBlank()) {

                order.setTimelineStatus(
                        "Ordered"
                );
            }

            if(order.getItems() != null) {

                for(OrderItem item :
                        order.getItems()) {

                    if(item.getStatus() == null
                            || item.getStatus().isBlank()) {

                        item.setStatus(
                                "Ordered"
                        );
                    }
                }
            }
        }

        return orders;
    }

    // GET EXCHANGED ORDERS
    @GetMapping("/exchanged/{userId}")
    public List<Order> getExchangedOrders(
            @PathVariable Long userId
    ) {

        return orderRepository
                .findByUserIdAndStatus(
                        userId,
                        "Exchanged"
                );
    }

    // GET CANCELLED ORDERS
    @GetMapping("/cancelled/{userId}")
    public List<Order> getCancelledOrders(
            @PathVariable Long userId
    ) {

        return orderRepository
                .findByUserIdAndStatus(
                        userId,
                        "Cancelled"
                );
    }

    // UPDATE COMPLETE ORDER STATUS
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {

        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        String newStatus =
                payload.get("status");

        order.setStatus(
                newStatus
        );

        order.setTimelineStatus(
                newStatus
        );

        String today =
                java.time.LocalDate.now()
                        .toString();

        switch(newStatus) {

            case "Packed":
                order.setPackedDate(today);
                break;

            case "Picked Up":
                order.setPickedUpDate(today);
                break;

            case "In Transit":
                order.setInTransitDate(today);
                break;

            case "Out For Delivery":
                order.setOutForDeliveryDate(today);
                break;

            case "Delivered":
                order.setDeliveredDate(today);
                break;
        }

        createNotification(

                order.getUserId(),

                "Order Update",

                "Order #" +
                        order.getId() +
                        " is now " +
                        newStatus

        );

        return orderRepository.save(order);
    }

    // CANCEL COMPLETE ORDER
    @PutMapping("/{id}/cancel")
    public Order cancelOrder(
            @PathVariable Long id
    ) {

        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        String status = order.getTimelineStatus();

        if(
                "Packed".equals(status)
                        ||
                        "Picked Up".equals(status)
                        ||
                        "In Transit".equals(status)
                        ||
                        "Out For Delivery".equals(status)
                        ||
                        "Delivered".equals(status)
        ) {

            throw new RuntimeException(
                    "Order can no longer be cancelled."
            );
        }

        // RESTORE STOCK

        for(OrderItem item :
                order.getItems()) {

            Product product =
                    productRepository.findById(
                            item.getProductId()
                    ).orElse(null);

            if(product != null) {

                product.setStockQuantity(
                        product.getStockQuantity()
                                + item.getQuantity()
                );

                productRepository.save(product);
            }
        }



        order.setCancelled(true);

        order.setStatus("Cancelled");

        createNotification(

                order.getUserId(),

                "Order Cancelled",

                "Order #" +
                        order.getId() +
                        " has been cancelled."

        );

        return orderRepository.save(order);
    }

    // EXCHANGE COMPLETE ORDER
    @PutMapping("/{id}/exchange")
    public Order exchangeOrder(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {

        Order order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        if(
                !"Delivered".equals(
                        order.getTimelineStatus()
                )
        ) {

            throw new RuntimeException(
                    "Exchange allowed only after delivery."
            );
        }

        if(order.getDeliveredDate() == null) {

            throw new RuntimeException(
                    "Delivery date not found."
            );
        }

        java.time.LocalDate deliveredDate =
                java.time.LocalDate.parse(
                        order.getDeliveredDate()
                );

        if(
                deliveredDate.plusDays(7)
                        .isBefore(
                                java.time.LocalDate.now()
                        )
        ) {

            throw new RuntimeException(
                    "Exchange window expired."
            );
        }

        order.setExchangeRequested(true);

        order.setExchangeReason(
                payload.get("reason")
        );

        order.setStatus("Exchanged");

        createNotification(

                order.getUserId(),

                "Exchange Requested",

                "Exchange requested for Order #" +
                        order.getId()

        );

        return orderRepository.save(order);
    }

    // ============================================
    // ITEM LEVEL STATUS UPDATE
    // ============================================

    @PutMapping("/item/{itemId}/status")
    public OrderItem updateItemStatus(
            @PathVariable Long itemId,
            @RequestBody Map<String, String> payload
    ) {

        OrderItem item =
                orderItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order item not found"
                                ));

        String newStatus =
                payload.get("status");

        item.setStatus(
                newStatus
        );

        String today =
                java.time.LocalDate.now()
                        .toString();

        switch(newStatus) {

            case "Packed":
                item.setPackedDate(today);
                break;

            case "Picked Up":
                item.setPickedUpDate(today);
                break;

            case "In Transit":
                item.setInTransitDate(today);
                break;

            case "Out For Delivery":
                item.setOutForDeliveryDate(today);
                break;

            case "Delivered":
                item.setDeliveredDate(today);
                break;
        }
        Order order = orderRepository.findAll().stream()
                .filter(o -> o.getItems().stream()
                        .anyMatch(i -> i.getId().equals(itemId)))
                .findFirst()
                .orElse(null);

        if(order != null) {

            createNotification(
                    order.getUserId(),
                    "Item Exchange Requested",
                    "Exchange requested for item "
                            + item.getName()
                            + " in Order #"
                            + order.getId()
            );
        }

        return orderItemRepository.save(item);
    }

    // ============================================
    // ITEM LEVEL CANCEL
    // ============================================

    @PutMapping("/item/{itemId}/cancel")
    public OrderItem cancelItem(
            @PathVariable Long itemId
    ) {

        OrderItem item =
                orderItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order item not found"
                                ));

        String status = item.getStatus();

        if(
                "Packed".equals(status)
                        ||
                        "Picked Up".equals(status)
                        ||
                        "In Transit".equals(status)
                        ||
                        "Out For Delivery".equals(status)
                        ||
                        "Delivered".equals(status)
                        ||
                        "Unable To Deliver".equals(status)
                        ||
                        "Cancelled".equals(status)
        ) {

            throw new RuntimeException(
                    "Item can no longer be cancelled."
            );
        }

        Product product =
                productRepository.findById(
                        item.getProductId()
                ).orElse(null);

        if(product != null) {

            product.setStockQuantity(
                    product.getStockQuantity()
                            + item.getQuantity()
            );

            productRepository.save(product);
        }

        item.setCancelled(true);

        item.setStatus("Cancelled");

        OrderItem savedItem = orderItemRepository.save(item);

        Order order = orderRepository.findAll().stream()
                .filter(o -> o.getItems().stream().anyMatch(i -> i.getId().equals(itemId)))
                .findFirst()
                .orElse(null);

        if (order != null) {
            createNotification(
                    order.getUserId(),
                    "Item Cancelled",
                    "Item " + item.getName() + " in Order #" + order.getId() + " has been cancelled."
            );
        }

        return savedItem;
    }

    // ============================================
    // ITEM LEVEL EXCHANGE
    // ============================================

    @PutMapping("/item/{itemId}/exchange")
    public OrderItem exchangeItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, String> payload
    ) {

        OrderItem item =
                orderItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order item not found"
                                ));

        // MUST BE DELIVERED

        if(
                !"Delivered".equals(
                        item.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Item must be delivered before exchange."
            );
        }

        // FIND PARENT ORDER

        if(
                item.getDeliveredDate()
                        == null
        ) {

            throw new RuntimeException(
                    "Delivery date not found."
            );
        }

        java.time.LocalDate deliveredDate =
                java.time.LocalDate.parse(
                        item.getDeliveredDate()
                );

        if(
                deliveredDate.plusDays(7)
                        .isBefore(
                                java.time.LocalDate.now()
                        )
        )
        {

            throw new RuntimeException(
                    "Exchange window expired."
            );
        }

        // MARK EXCHANGE

        item.setExchangeRequested(
                true
        );

        item.setExchangeReason(
                payload.get("reason")
        );

        item.setStatus(
                "Exchanged"
        );

        return orderItemRepository.save(
                item
        );
    }

    private void createNotification(
            Long userId,
            String title,
            String message
    ) {

        Notification notification =
                new Notification();

        notification.setUserId(
                userId
        );

        notification.setTitle(
                title
        );

        notification.setMessage(
                message
        );

        notification.setDate(
                java.time.LocalDate.now()
                        .toString()
        );

        notificationRepository
                .save(notification);
    }
}