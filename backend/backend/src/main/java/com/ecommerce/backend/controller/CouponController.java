package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Coupon;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.repository.CouponRepository;
import com.ecommerce.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coupons")
@CrossOrigin(origins = "http://localhost:3000")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private OrderRepository orderRepository;

    // GET ALL COUPONS
    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // CREATE COUPON
    @PostMapping
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponRepository.save(coupon);
    }

    // UPDATE COUPON
    @PutMapping("/{id}")
    public Coupon updateCoupon(
            @PathVariable Long id,
            @RequestBody Coupon updatedCoupon
    ) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        coupon.setCode(updatedCoupon.getCode());
        coupon.setDiscountType(updatedCoupon.getDiscountType());
        coupon.setDiscountValue(updatedCoupon.getDiscountValue());
        coupon.setMinimumOrderValue(updatedCoupon.getMinimumOrderValue());
        coupon.setExpiryDate(updatedCoupon.getExpiryDate());
        coupon.setActive(updatedCoupon.getActive());

        return couponRepository.save(coupon);
    }

    // DELETE COUPON
    @DeleteMapping("/{id}")
    public String deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
        return "Coupon deleted successfully";
    }

    // VALIDATE COUPON (Enhanced for eligibility)
    @PostMapping("/validate")
    public Map<String, Object> validateCoupon(
            @RequestBody Map<String, Object> payload
    ) {
        String code = payload.get("code").toString();
        Double cartTotal = Double.parseDouble(payload.get("cartTotal").toString());

        Long userId = null;
        if (payload.get("userId") != null) {
            try {
                userId = Long.parseLong(payload.get("userId").toString());
            } catch (Exception e) {
                // ignore
            }
        }

        List<Map<String, Object>> items = null;
        if (payload.get("items") != null) {
            try {
                items = (List<Map<String, Object>>) payload.get("items");
            } catch (Exception e) {
                // ignore
            }
        }

        Map<String, Object> response = new HashMap<>();
        Coupon coupon = couponRepository.findByCode(code);

        if (coupon == null) {
            response.put("valid", false);
            response.put("message", "Invalid coupon code");
            return response;
        }

        Map<String, Object> eligibility = checkCouponEligibility(coupon, cartTotal, userId, items);
        boolean isEligible = (boolean) eligibility.get("eligible");
        if (!isEligible) {
            response.put("valid", false);
            response.put("message", eligibility.get("reason").toString());
            return response;
        }

        double discountAmount;
        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = cartTotal * coupon.getDiscountValue() / 100.0;
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        double finalAmount = cartTotal - discountAmount;

        response.put("valid", true);
        response.put("couponCode", coupon.getCode());
        response.put("discount", discountAmount);
        response.put("finalAmount", finalAmount);

        return response;
    }

    // CHECK ALL ACTIVE COUPONS ELIGIBILITY FOR A USER
    @PostMapping("/eligibility")
    public List<Map<String, Object>> getCouponsEligibility(
            @RequestBody Map<String, Object> payload
    ) {
        Double cartTotal = Double.parseDouble(payload.get("cartTotal").toString());

        Long userId = null;
        if (payload.get("userId") != null) {
            try {
                userId = Long.parseLong(payload.get("userId").toString());
            } catch (Exception e) {
                // ignore
            }
        }

        List<Map<String, Object>> items = null;
        if (payload.get("items") != null) {
            try {
                items = (List<Map<String, Object>>) payload.get("items");
            } catch (Exception e) {
                // ignore
            }
        }

        List<Coupon> activeCoupons = couponRepository.findAll().stream()
                .filter(c -> Boolean.TRUE.equals(c.getActive()))
                .toList();

        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Coupon coupon : activeCoupons) {
            Map<String, Object> eligibility = checkCouponEligibility(coupon, cartTotal, userId, items);
            Map<String, Object> couponMap = new HashMap<>();
            
            couponMap.put("id", coupon.getId());
            couponMap.put("code", coupon.getCode());
            couponMap.put("discountType", coupon.getDiscountType());
            couponMap.put("discountValue", coupon.getDiscountValue());
            couponMap.put("minimumOrderValue", coupon.getMinimumOrderValue());
            couponMap.put("expiryDate", coupon.getExpiryDate());
            couponMap.put("active", coupon.getActive());
            couponMap.put("eligible", eligibility.get("eligible"));
            couponMap.put("reason", eligibility.get("reason"));
            
            // Build requirements text
            couponMap.put("requirements", getRequirementsText(coupon));
            
            // Build dynamic description
            couponMap.put("description", getDynamicDescription(coupon));

            resultList.add(couponMap);
        }

        return resultList;
    }

    // ELIGIBILITY ENGINE HELPER METHOD
    private Map<String, Object> checkCouponEligibility(
            Coupon coupon, 
            Double cartTotal, 
            Long userId, 
            List<Map<String, Object>> items
    ) {
        Map<String, Object> result = new HashMap<>();
        result.put("eligible", true);
        result.put("reason", "Eligible");

        // 1. Active Status Check
        if (coupon.getActive() == null || !coupon.getActive()) {
            result.put("eligible", false);
            result.put("reason", "Coupon is inactive");
            return result;
        }

        // 2. Expiry Date Check
        if (coupon.getExpiryDate() != null) {
            try {
                LocalDate expiryDate = LocalDate.parse(coupon.getExpiryDate());
                if (expiryDate.isBefore(LocalDate.now())) {
                    result.put("eligible", false);
                    result.put("reason", "Coupon has expired");
                    return result;
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }

        // 3. Minimum Cart Value Check
        if (coupon.getMinimumOrderValue() != null && cartTotal < coupon.getMinimumOrderValue()) {
            result.put("eligible", false);
            result.put("reason", "Minimum cart value ₹" + Math.round(coupon.getMinimumOrderValue()) + " required");
            return result;
        }

        // 4. Coupon Specific Custom Rules
        String code = coupon.getCode().toUpperCase();
        if (code.contains("WELCOME")) {
            if (userId == null) {
                result.put("eligible", false);
                result.put("reason", "Requires a logged-in account");
                return result;
            }
            List<Order> validOrders = orderRepository.findValidByUserId(userId);
            if (validOrders != null && !validOrders.isEmpty()) {
                result.put("eligible", false);
                result.put("reason", "Only valid for first order");
                return result;
            }
        } else if (code.contains("FASHION")) {
            boolean hasFashion = false;
            if (items != null) {
                for (Map<String, Object> item : items) {
                    if (item.get("category") != null) {
                        String cat = item.get("category").toString().toLowerCase();
                        if (isFashionCategory(cat)) {
                            hasFashion = true;
                            break;
                        }
                    }
                }
            }
            if (!hasFashion) {
                result.put("eligible", false);
                result.put("reason", "Requires Fashion category purchase");
                return result;
            }
        }

        return result;
    }

    private boolean isFashionCategory(String cat) {
        return "fashion".equals(cat) || "dress".equals(cat) || "top".equals(cat) || "shirt".equals(cat) 
            || "jacket".equals(cat) || "jeans".equals(cat) || "kurti".equals(cat) || "skirt".equals(cat);
    }

    private String getRequirementsText(Coupon coupon) {
        List<String> reqs = new ArrayList<>();
        String code = coupon.getCode().toUpperCase();

        if (code.contains("WELCOME")) {
            reqs.add("Only valid for first order");
        } else if (code.contains("FASHION")) {
            reqs.add("Requires Fashion category purchase");
        }

        if (coupon.getMinimumOrderValue() != null && coupon.getMinimumOrderValue() > 0) {
            reqs.add("Minimum cart value ₹" + Math.round(coupon.getMinimumOrderValue()) + " required");
        }

        return String.join(" • ", reqs);
    }

    private String getDynamicDescription(Coupon coupon) {
        String code = coupon.getCode().toUpperCase();
        String discountText = "PERCENT".equalsIgnoreCase(coupon.getDiscountType())
                ? Math.round(coupon.getDiscountValue()) + "%"
                : "₹" + Math.round(coupon.getDiscountValue());

        if (code.contains("WELCOME")) {
            return "Get " + discountText + " off on your first order!";
        } else if (code.contains("FASHION")) {
            return "Get " + discountText + " off on apparel and fashion items!";
        } else {
            return "Get " + discountText + " off on your entire purchase!";
        }
    }
}