package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.repository.AddressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {

    @Autowired
    private AddressRepository repo;

    @GetMapping("/{userId}")
    public List<Address> getAddresses(
            @PathVariable Long userId
    ) {

        return repo.findByUserId(userId);
    }

    private void clearOtherDefaults(Long userId) {
        if (userId == null) return;
        List<Address> addresses = repo.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.getIsDefault() != null && addr.getIsDefault()) {
                addr.setIsDefault(false);
                repo.save(addr);
            }
        }
    }

    @PostMapping
    public Address saveAddress(
            @RequestBody Address address
    ) {
        if (address.getIsDefault() != null && address.getIsDefault()) {
            clearOtherDefaults(address.getUserId());
        }
        return repo.save(address);
    }

    @PutMapping("/{id}")
    public Address updateAddress(
            @PathVariable Long id,
            @RequestBody Address updated
    ) {

        Address address =
                repo.findById(id)
                        .orElse(null);

        if(address == null)
            return null;

        if (updated.getIsDefault() != null && updated.getIsDefault()) {
            clearOtherDefaults(address.getUserId());
        }

        address.setFullName(updated.getFullName());
        address.setPhone(updated.getPhone());
        address.setAddressLine1(updated.getAddressLine1());
        address.setAddressLine2(updated.getAddressLine2());
        address.setCity(updated.getCity());
        address.setState(updated.getState());
        address.setPincode(updated.getPincode());
        address.setCountry(updated.getCountry());
        address.setIsDefault(updated.getIsDefault());

        return repo.save(address);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(
            @PathVariable Long id
    ) {

        repo.deleteById(id);
    }
}