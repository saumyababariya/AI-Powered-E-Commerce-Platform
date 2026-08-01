package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Notification;
import com.ecommerce.backend.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins =
        "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationRepository
            notificationRepository;

    @GetMapping("/{userId}")
    public List<Notification>
    getNotifications(
            @PathVariable Long userId
    ) {

        return notificationRepository
                .findByUserIdOrderByIdDesc(
                        userId
                );
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id
    ) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow();

        notification.setReadStatus(
                true
        );

        return notificationRepository
                .save(notification);
    }
}