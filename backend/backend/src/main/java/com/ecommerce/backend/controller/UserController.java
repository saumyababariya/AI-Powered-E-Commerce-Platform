package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository repo;

    // GET ALL USERS
    @GetMapping
    public List<User> getUsers() {
        return repo.findAll();
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id
    ) {
        return repo.findById(id).orElse(null);
    }

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        User existingUser =
                repo.findByEmail(user.getEmail());

        if(existingUser != null) {

            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }

        if(user.getRole() == null ||
                user.getRole().isEmpty()) {

            user.setRole("USER");
        }

        user.setRegistrationDate(
                java.time.LocalDate.now()
        );

        user.setRegistrationDate(
                java.time.LocalDate.now()
        );

        User savedUser = repo.save(user);

        return ResponseEntity.ok(savedUser);
    }

    // LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User loginData
    ) {

        User user =
                repo.findByEmail(
                        loginData.getEmail()
                );

        if(user == null) {

            return ResponseEntity
                    .status(404)
                    .body("Email is not registered.");
        }

        if(!user.getPassword()
                .equals(
                        loginData.getPassword()
                )) {

            return ResponseEntity
                    .status(401)
                    .body("Wrong login credentials.");
        }

        return ResponseEntity.ok(user);
    }

    // UPDATE USER PROFILE
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ) {

        User user =
                repo.findById(id).orElse(null);

        if(user != null) {

            user.setFullName(
                    updatedUser.getFullName()
            );

            user.setEmail(
                    updatedUser.getEmail()
            );

            user.setPhone(
                    updatedUser.getPhone()
            );

            user.setGender(
                    updatedUser.getGender()
            );

            user.setAddress(
                    updatedUser.getAddress()
            );

            return repo.save(user);
        }

        return null;
    }

    @PutMapping("/{id}/theme")
    public User updateTheme(
            @PathVariable Long id,
            @RequestBody Map<String,String> payload
    ) {

        User user =
                repo.findById(id)
                        .orElse(null);

        if(user == null) {
            return null;
        }

        user.setTheme(
                payload.get("theme")
        );

        return repo.save(user);
    }
}