package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.UserBudget;
import com.ecommerce.backend.entity.UserReward;
import com.ecommerce.backend.entity.CategoryBudget;
import com.ecommerce.backend.repository.UserBudgetRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.UserRewardRepository;
import com.ecommerce.backend.repository.CategoryBudgetRepository;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.repository.CartRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.Month;
import java.util.ArrayList;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private UserBudgetRepository userBudgetRepository;

        @Autowired
        private UserRewardRepository userRewardRepository;

        @Autowired
        private CartRepository cartRepository;

        @Autowired
        private CategoryBudgetRepository categoryBudgetRepository;

        @GetMapping("/dashboard")
        public Map<String, Object> getDashboardStats() {

                Map<String, Object> data = new HashMap<>();

                List<Order> orders = orderRepository.findAll();

                List<Product> products = productRepository.findAll();

                List<User> users = userRepository.findAll();

                double totalRevenue = orders.stream()
                                .filter(order -> !"Cancelled".equals(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .sum();

                data.put(
                                "totalRevenue",
                                totalRevenue);

                data.put(
                                "totalOrders",
                                orders.size());

                data.put(
                                "totalProducts",
                                products.size());

                data.put(
                                "totalUsers",
                                users.size());

                List<Product> topProducts = productRepository.findAll()
                                .stream()
                                .sorted(
                                                (a, b) -> Integer.compare(
                                                                b.getSalesCount(),
                                                                a.getSalesCount()))
                                .limit(5)
                                .toList();

                data.put(
                                "topProducts",
                                topProducts);

                List<Order> recentOrders = orderRepository.findAll()
                                .stream()
                                .sorted(
                                                (a, b) -> b.getId()
                                                                .compareTo(
                                                                                a.getId()))
                                .limit(5)
                                .toList();

                data.put(
                                "recentOrders",
                                recentOrders);

                java.time.YearMonth currentMonth = java.time.YearMonth.now();

                double revenueThisMonth = orders.stream()
                                .filter(order -> {

                                        try {

                                                java.time.LocalDate date = java.time.LocalDate.parse(
                                                                order.getDate());

                                                return java.time.YearMonth
                                                                .from(date)
                                                                .equals(currentMonth);

                                        } catch (Exception e) {

                                                return false;
                                        }

                                })
                                .filter(order -> !"Cancelled".equals(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .sum();

                data.put(
                                "revenueThisMonth",
                                revenueThisMonth);

                long ordersThisMonth = orders.stream()
                                .filter(order -> {

                                        try {

                                                java.time.LocalDate date = java.time.LocalDate.parse(
                                                                order.getDate());

                                                return java.time.YearMonth
                                                                .from(date)
                                                                .equals(currentMonth);

                                        } catch (Exception e) {

                                                return false;
                                        }

                                })
                                .count();

                data.put(
                                "ordersThisMonth",
                                ordersThisMonth);

                Map<String, Integer> categorySales = new HashMap<>();

                for (Product product : products) {

                        categorySales.put(

                                        product.getCategory(),

                                        categorySales.getOrDefault(
                                                        product.getCategory(),
                                                        0) + product.getSalesCount());
                }

                List<Map<String, Object>> topCategories = categorySales.entrySet()
                                .stream()
                                .sorted(
                                                (a, b) -> b.getValue()
                                                                .compareTo(
                                                                                a.getValue()))
                                .limit(5)
                                .map(entry -> {

                                        Map<String, Object> category = new HashMap<>();

                                        category.put(
                                                        "category",
                                                        entry.getKey());

                                        category.put(
                                                        "sales",
                                                        entry.getValue());

                                        return category;
                                })
                                .toList();

                data.put(
                                "topCategories",
                                topCategories);
                return data;
        }

        @GetMapping("/monthly-revenue")
        public List<Map<String, Object>> getMonthlyRevenue() {

                List<Order> orders = orderRepository.findAll();

                Map<String, Double> revenueMap = new TreeMap<>();

                for (Order order : orders) {

                        if ("Cancelled".equals(
                                        order.getStatus())) {
                                continue;
                        }

                        try {

                                java.time.LocalDate date = java.time.LocalDate.parse(
                                                order.getDate());

                                String month = date.getYear()
                                                + "-"
                                                + String.format(
                                                                "%02d",
                                                                date.getMonthValue());

                                revenueMap.put(

                                                month,

                                                revenueMap.getOrDefault(
                                                                month,
                                                                0.0)
                                                                +
                                                                order.getTotalAmount());

                        } catch (Exception ignored) {
                        }
                }

                List<Map<String, Object>> result = new ArrayList<>();

                revenueMap.forEach((month, revenue) -> {

                        Map<String, Object> row = new HashMap<>();

                        row.put(
                                        "month",
                                        month);

                        row.put(
                                        "revenue",
                                        revenue);

                        result.add(row);
                });

                return result;
        }

        @GetMapping("/monthly-orders")
        public List<Map<String, Object>> getMonthlyOrders() {

                List<Order> orders = orderRepository.findAll();

                Map<String, Integer> ordersMap = new TreeMap<>();

                for (Order order : orders) {

                        try {

                                java.time.LocalDate date = java.time.LocalDate.parse(
                                                order.getDate());

                                String month = date.getYear()
                                                + "-"
                                                + String.format(
                                                                "%02d",
                                                                date.getMonthValue());

                                ordersMap.put(

                                                month,

                                                ordersMap.getOrDefault(
                                                                month,
                                                                0) + 1);

                        } catch (Exception ignored) {
                        }
                }

                List<Map<String, Object>> result = new ArrayList<>();

                ordersMap.forEach((month, count) -> {

                        Map<String, Object> row = new HashMap<>();

                        row.put(
                                        "month",
                                        month);

                        row.put(
                                        "orders",
                                        count);

                        result.add(row);
                });

                return result;
        }

        @GetMapping("/category-distribution")
        public List<Map<String, Object>> getCategoryDistribution() {

                List<Product> products = productRepository.findAll();

                Map<String, Integer> categoryMap = new HashMap<>();

                for (Product product : products) {

                        categoryMap.put(

                                        product.getCategory(),

                                        categoryMap.getOrDefault(
                                                        product.getCategory(),
                                                        0)
                                                        +
                                                        product.getSalesCount());
                }

                List<Map<String, Object>> result = new ArrayList<>();

                categoryMap.forEach((category, sales) -> {

                        Map<String, Object> row = new HashMap<>();

                        row.put(
                                        "category",
                                        category);

                        row.put(
                                        "sales",
                                        sales);

                        result.add(row);
                });

                return result;
        }

        @GetMapping("/customer-analytics")
        public Map<String, Object> getCustomerAnalytics() {

                Map<String, Object> data = new HashMap<>();

                List<Order> orders = orderRepository.findAll();

                List<Product> products = productRepository.findAll();

                // ====================================
                // TOTAL CUSTOMERS
                // ====================================

                long totalCustomers = orders.stream()
                                .map(Order::getUserId)
                                .distinct()
                                .count();

                data.put(
                                "totalCustomers",
                                totalCustomers);

                // ====================================
                // AVERAGE ORDER VALUE
                // ====================================

                double averageOrderValue = orders.stream()
                                .filter(order -> !"Cancelled".equals(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .average()
                                .orElse(0);

                data.put(
                                "averageOrderValue",
                                averageOrderValue);

                // ====================================
                // TOP CUSTOMERS
                // ====================================

                Map<Long, Double> customerSpend = new HashMap<>();

                for (Order order : orders) {

                        if ("Cancelled".equals(
                                        order.getStatus())) {
                                continue;
                        }

                        customerSpend.put(

                                        order.getUserId(),

                                        customerSpend.getOrDefault(
                                                        order.getUserId(),
                                                        0.0)
                                                        +
                                                        order.getTotalAmount());
                }

                List<Map<String, Object>> topCustomers = customerSpend.entrySet()
                                .stream()
                                .sorted(
                                                (a, b) -> Double.compare(
                                                                b.getValue(),
                                                                a.getValue()))
                                .limit(5)
                                .map(entry -> {

                                        Map<String, Object> row = new HashMap<>();

                                        row.put(
                                                        "userId",
                                                        entry.getKey());

                                        row.put(
                                                        "totalSpent",
                                                        entry.getValue());

                                        return row;
                                })
                                .toList();

                data.put(
                                "topCustomers",
                                topCustomers);

                // ====================================
                // REPEAT CUSTOMERS
                // ====================================

                Map<Long, Integer> orderCounts = new HashMap<>();

                for (Order order : orders) {

                        orderCounts.put(

                                        order.getUserId(),

                                        orderCounts.getOrDefault(
                                                        order.getUserId(),
                                                        0) + 1);
                }

                long repeatCustomers = orderCounts.values()
                                .stream()
                                .filter(count -> count > 1)
                                .count();

                data.put(
                                "repeatCustomers",
                                repeatCustomers);

                // ====================================
                // MOST PURCHASED CATEGORIES
                // ====================================

                Map<String, Integer> categorySales = new HashMap<>();

                for (Product product : products) {

                        categorySales.put(

                                        product.getCategory(),

                                        categorySales.getOrDefault(
                                                        product.getCategory(),
                                                        0)
                                                        +
                                                        product.getSalesCount());
                }

                List<Map<String, Object>> topCategories =

                                categorySales.entrySet()
                                                .stream()
                                                .sorted(
                                                                (a, b) -> b.getValue()
                                                                                .compareTo(
                                                                                                a.getValue()))
                                                .limit(5)
                                                .map(entry -> {

                                                        Map<String, Object> row = new HashMap<>();

                                                        row.put(
                                                                        "category",
                                                                        entry.getKey());

                                                        row.put(
                                                                        "sales",
                                                                        entry.getValue());

                                                        return row;
                                                })
                                                .toList();

                data.put(
                                "topCategories",
                                topCategories);

                return data;
        }

        @GetMapping("/low-stock")
        public List<Map<String, Object>> getLowStockProducts() {

                List<Product> products = productRepository.findAll();

                return products.stream()

                                .filter(product ->

                                product.getStockQuantity() <= 5)

                                .sorted(
                                                (a, b) ->

                                                Integer.compare(
                                                                a.getStockQuantity(),
                                                                b.getStockQuantity()))

                                .map(product -> {

                                        Map<String, Object> row = new HashMap<>();

                                        row.put(
                                                        "id",
                                                        product.getId());

                                        row.put(
                                                        "name",
                                                        product.getName());

                                        row.put(
                                                        "category",
                                                        product.getCategory());

                                        row.put(
                                                        "stock",
                                                        product.getStockQuantity());

                                        row.put(
                                                        "salesCount",
                                                        product.getSalesCount());

                                        return row;
                                })

                                .toList();
        }

        @GetMapping("/expense-tracker/{userId}")
        public Map<String, Object> getExpenseTracker(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                List<Order> orders = orderRepository.findByUserId(userId);

                double totalSpent = 0;

                double thisMonthSpent = 0;

                double largestPurchase = 0;

                int totalOrders = 0;

                Map<String, Double> categorySpending = new HashMap<>();

                Map<String, Double> brandSpending = new HashMap<>();

                Map<String, Double> monthlyTrend = new TreeMap<>();

                String favoriteCategory = "";

                String favoriteBrand = "";

                for (Order order : orders) {

                        if ("Cancelled".equals(order.getStatus())) {
                                continue;
                        }

                        totalOrders++;

                        totalSpent += order.getTotalAmount();

                        if (order.getTotalAmount() > largestPurchase) {
                                largestPurchase = order.getTotalAmount();
                        }

                        try {

                                LocalDate orderDate = LocalDate.parse(
                                                order.getDate());

                                if (YearMonth.from(orderDate)
                                                .equals(
                                                                YearMonth.now())) {

                                        thisMonthSpent += order.getTotalAmount();
                                }

                                String monthKey = orderDate.getYear()
                                                + "-"
                                                + String.format(
                                                                "%02d",
                                                                orderDate.getMonthValue());

                                monthlyTrend.put(

                                                monthKey,

                                                monthlyTrend.getOrDefault(
                                                                monthKey,
                                                                0.0)
                                                                +
                                                                order.getTotalAmount());

                        } catch (Exception ignored) {
                        }

                        for (OrderItem item : order.getItems()) {

                                Product product = productRepository.findById(
                                                item.getProductId()).orElse(null);

                                if (product == null) {
                                        continue;
                                }

                                String category = product.getCategory();

                                String brand = product.getBrand();

                                double amount = item.getFinalPrice()
                                                * item.getQuantity();

                                categorySpending.put(

                                                category,

                                                categorySpending
                                                                .getOrDefault(
                                                                                category,
                                                                                0.0)
                                                                +
                                                                amount);

                                brandSpending.put(

                                                brand,

                                                brandSpending
                                                                .getOrDefault(
                                                                                brand,
                                                                                0.0)
                                                                +
                                                                amount);
                        }
                }

                favoriteCategory = categorySpending.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse(
                                                "N/A");

                favoriteBrand = brandSpending.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse(
                                                "N/A");

                double averageOrderValue = totalOrders == 0
                                ? 0
                                : totalSpent / totalOrders;

                data.put(
                                "totalSpent",
                                totalSpent);

                data.put(
                                "thisMonthSpent",
                                thisMonthSpent);

                data.put(
                                "averageOrderValue",
                                averageOrderValue);

                data.put(
                                "largestPurchase",
                                largestPurchase);

                data.put(
                                "totalOrders",
                                totalOrders);

                data.put(
                                "favoriteCategory",
                                favoriteCategory);

                data.put(
                                "favoriteBrand",
                                favoriteBrand);

                data.put(
                                "categorySpending",
                                categorySpending);

                data.put(
                                "brandSpending",
                                brandSpending);

                data.put(
                                "monthlyTrend",
                                monthlyTrend);

                return data;
        }

        @GetMapping("/shopping-insights/{userId}")
        public Map<String, Object> getShoppingInsights(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                List<Order> orders = orderRepository.findByUserId(userId);

                double totalSpent = 0;

                double totalSavings = 0;

                double largestPurchase = 0;

                Map<String, Double> categorySpend = new HashMap<>();

                Map<String, Double> brandSpend = new HashMap<>();

                Map<String, Double> monthlySpend = new TreeMap<>();

                Map<String, Integer> productCounts = new HashMap<>();

                List<LocalDate> orderDates = new ArrayList<>();

                for (Order order : orders) {

                        if ("Cancelled".equals(
                                        order.getStatus())) {
                                continue;
                        }

                        totalSpent += order.getTotalAmount();

                        if (order.getTotalAmount() > largestPurchase) {

                                largestPurchase = order.getTotalAmount();
                        }

                        try {

                                LocalDate date = LocalDate.parse(
                                                order.getDate());

                                orderDates.add(date);

                                String month = date.getYear()
                                                + "-"
                                                + String.format(
                                                                "%02d",
                                                                date.getMonthValue());

                                monthlySpend.put(

                                                month,

                                                monthlySpend.getOrDefault(
                                                                month,
                                                                0.0)
                                                                +
                                                                order.getTotalAmount());

                        } catch (Exception ignored) {
                        }

                        for (OrderItem item : order.getItems()) {

                                Product product = productRepository
                                                .findById(
                                                                item.getProductId())
                                                .orElse(null);

                                if (product == null) {
                                        continue;
                                }

                                double amount = item.getFinalPrice()
                                                *
                                                item.getQuantity();

                                categorySpend.put(

                                                product.getCategory(),

                                                categorySpend
                                                                .getOrDefault(
                                                                                product.getCategory(),
                                                                                0.0)
                                                                +
                                                                amount);

                                brandSpend.put(

                                                product.getBrand(),

                                                brandSpend
                                                                .getOrDefault(
                                                                                product.getBrand(),
                                                                                0.0)
                                                                +
                                                                amount);

                                productCounts.put(

                                                product.getName(),

                                                productCounts
                                                                .getOrDefault(
                                                                                product.getName(),
                                                                                0)
                                                                +
                                                                item.getQuantity());

                                totalSavings +=

                                                (item.getPrice()
                                                                -
                                                                item.getFinalPrice())
                                                                *
                                                                item.getQuantity();
                        }
                }

                String favoriteCategory = categorySpend.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse("N/A");

                String favoriteBrand = brandSpend.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse("N/A");

                String mostPurchasedProduct = productCounts.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse("N/A");

                double categoryPercentage = 0;

                if (categorySpend.containsKey(
                                favoriteCategory)
                                &&
                                totalSpent > 0) {

                        categoryPercentage =

                                        (categorySpend.get(
                                                        favoriteCategory)
                                                        /
                                                        totalSpent) * 100;
                }

                String highestMonth = monthlySpend.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse("N/A");

                double averageOrderValue = orders.isEmpty()
                                ? 0
                                : totalSpent
                                                / orders.size();

                int categoryDiversity = categorySpend.size();

                double loyaltyPercentage = 0;

                if (totalSpent > 0 &&
                                brandSpend.containsKey(
                                                favoriteBrand)) {

                        loyaltyPercentage =

                                        (brandSpend.get(
                                                        favoriteBrand)
                                                        /
                                                        totalSpent)
                                                        * 100;
                }
                Set<LocalDate> uniqueDates = new TreeSet<>(orderDates);

                orderDates = new ArrayList<>(uniqueDates);

                Collections.sort(orderDates);

                double averageGapDays = 0;

                if (orderDates.size() > 1) {

                        long totalGap = 0;

                        for (int i = 1; i < orderDates.size(); i++) {

                                totalGap +=

                                                java.time.temporal.ChronoUnit.DAYS
                                                                .between(

                                                                                orderDates.get(i - 1),

                                                                                orderDates.get(i));
                        }

                        averageGapDays = (double) totalGap
                                        /
                                        (orderDates.size() - 1);
                }

                double spendingGrowth = 0;

                if (monthlySpend.size() >= 2) {

                        List<Double> values = new ArrayList<>(
                                        monthlySpend.values());

                        double previous = values.get(
                                        values.size() - 2);

                        double current = values.get(
                                        values.size() - 1);

                        if (previous > 0) {

                                spendingGrowth = ((current
                                                -
                                                previous)
                                                /
                                                previous)
                                                * 100;
                        }
                }

                data.put(
                                "favoriteCategory",
                                favoriteCategory);

                data.put(
                                "favoriteBrand",
                                favoriteBrand);

                data.put(
                                "categoryPercentage",
                                Math.round(categoryPercentage));

                data.put(
                                "highestSpendingMonth",
                                highestMonth);

                data.put(
                                "totalOrders",
                                orders.size());

                data.put(
                                "mostPurchasedProduct",
                                mostPurchasedProduct);

                data.put(
                                "largestPurchase",
                                largestPurchase);

                data.put(
                                "averageOrderValue",
                                averageOrderValue);

                data.put(
                                "categoryDiversity",
                                categoryDiversity);

                data.put(
                                "loyaltyPercentage",
                                Math.round(loyaltyPercentage));

                data.put(
                                "shoppingFrequencyDays",
                                String.format(
                                                "%.2f",
                                                averageGapDays));

                data.put(
                                "spendingGrowth",
                                Math.round(spendingGrowth));

                data.put(
                                "totalSavings",
                                totalSavings);

                return data;
        }

        @GetMapping("/personality/{userId}")
        public Map<String, Object> getPersonalityProfile(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                Map<String, Object> insights = getShoppingInsights(
                                userId);

                String favoriteCategory = (String) insights.get(
                                "favoriteCategory");

                long categoryPercentage = ((Number) insights.get(
                                "categoryPercentage")).longValue();

                long loyaltyPercentage = ((Number) insights.get(
                                "loyaltyPercentage")).longValue();

                double averageOrderValue = ((Number) insights.get(
                                "averageOrderValue")).doubleValue();

                double totalSavings = ((Number) insights.get(
                                "totalSavings")).doubleValue();

                double shoppingFrequency = Double.parseDouble(
                                insights.get(
                                                "shoppingFrequencyDays").toString());

                double totalSpent = orderRepository
                                .findByUserId(userId)
                                .stream()
                                .filter(order -> !"Cancelled".equals(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .sum();

                List<String> personalities = new ArrayList<>();

                List<String> insightsText = new ArrayList<>();

                // ========================
                // TECH ENTHUSIAST
                // ========================

                if ("Electronics".equalsIgnoreCase(
                                favoriteCategory)
                                &&
                                categoryPercentage >= 50) {

                        personalities.add(
                                        "Tech Enthusiast");

                        insightsText.add(
                                        "You frequently invest in technology products and gadgets.");
                }

                // ========================
                // FASHION EXPLORER
                // ========================

                if ("Fashion".equalsIgnoreCase(
                                favoriteCategory)
                                &&
                                categoryPercentage >= 50) {

                        personalities.add(
                                        "Fashion Explorer");

                        insightsText.add(
                                        "You enjoy discovering clothing, accessories and fashion trends.");
                }

                // ========================
                // KNOWLEDGE SEEKER
                // ========================

                if ("Books".equalsIgnoreCase(
                                favoriteCategory)) {

                        personalities.add(
                                        "Knowledge Seeker");

                        insightsText.add(
                                        "You consistently invest in learning and self-development.");
                }

                // ========================
                // IMPULSIVE SHOPPER
                // ========================

                if (shoppingFrequency > 0
                                &&
                                shoppingFrequency < 7) {

                        personalities.add(
                                        "Impulsive Shopper");

                        insightsText.add(
                                        "You tend to make purchases frequently and act quickly on buying decisions.");
                }

                // ========================
                // PLANNED BUYER
                // ========================

                if (shoppingFrequency >= 20) {

                        personalities.add(
                                        "Planned Buyer");

                        insightsText.add(
                                        "You carefully evaluate products before purchasing.");
                }

                // ========================
                // LOYAL CUSTOMER
                // ========================

                if (loyaltyPercentage >= 50) {

                        personalities.add(
                                        "Loyal Customer");

                        insightsText.add(
                                        "You consistently purchase from your preferred brands.");
                }

                // ========================
                // BUDGET CONSCIOUS
                // ========================

                if (totalSpent > 0
                                &&
                                (totalSavings
                                                /
                                                totalSpent) * 100 >= 10) {

                        personalities.add(
                                        "Budget Conscious Shopper");

                        insightsText.add(
                                        "You actively take advantage of discounts and offers.");
                }

                // ========================
                // PREMIUM SHOPPER
                // ========================

                if (averageOrderValue >= 5000) {

                        personalities.add(
                                        "Premium Shopper");

                        insightsText.add(
                                        "You prefer premium and higher-value purchases.");
                }

                if (personalities.isEmpty()) {

                        personalities.add(
                                        "Balanced Shopper");

                        insightsText.add(
                                        "You maintain a balanced shopping pattern across categories.");
                }

                data.put(
                                "personalities",
                                personalities);

                data.put(
                                "insights",
                                insightsText);

                String primaryPersonality = personalities.get(0);

                int confidence = 60;

                if (categoryPercentage >= 80) {

                        confidence = 95;

                } else if (categoryPercentage >= 70) {

                        confidence = 90;

                } else if (categoryPercentage >= 60) {

                        confidence = 80;

                } else if (categoryPercentage >= 50) {

                        confidence = 70;
                }

                String strength;

                if (confidence >= 85) {

                        strength = "Strong";

                } else if (confidence >= 60) {

                        strength = "Moderate";

                } else {

                        strength = "Emerging";
                }

                List<String> secondaryPersonalities = new ArrayList<>();

                if (personalities.size() > 1) {

                        secondaryPersonalities = personalities.subList(
                                        1,
                                        personalities.size());
                }

                String shoppingDna = "Your shopping behavior is primarily driven by "
                                + primaryPersonality
                                + ".";

                data.put(
                                "primaryPersonality",
                                primaryPersonality);

                data.put(
                                "secondaryPersonalities",
                                secondaryPersonalities);

                data.put(
                                "confidence",
                                confidence);

                data.put(
                                "personalityStrength",
                                strength);

                data.put(
                                "shoppingDna",
                                shoppingDna);

                return data;
        }

        @GetMapping("/personality-evolution/{userId}")
        public Map<String, Object> getPersonalityEvolution(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                List<Order> orders = orderRepository.findByUserId(userId);

                LocalDate today = LocalDate.now();

                LocalDate currentMonthStart = today.withDayOfMonth(1);

                LocalDate previousMonthStart = currentMonthStart.minusMonths(1);

                LocalDate previousMonthEnd = currentMonthStart.minusDays(1);

                Map<String, Double> currentCategorySpend = new HashMap<>();

                Map<String, Double> previousCategorySpend = new HashMap<>();

                for (Order order : orders) {

                        if ("Cancelled".equals(
                                        order.getStatus())) {
                                continue;
                        }

                        try {

                                LocalDate orderDate = LocalDate.parse(
                                                order.getDate());

                                Map<String, Double> targetMap = null;

                                if (!orderDate.isBefore(
                                                currentMonthStart)) {

                                        targetMap = currentCategorySpend;

                                } else if (!orderDate.isBefore(
                                                previousMonthStart)
                                                &&
                                                !orderDate.isAfter(
                                                                previousMonthEnd)) {

                                        targetMap = previousCategorySpend;
                                }

                                if (targetMap == null) {
                                        continue;
                                }

                                for (OrderItem item : order.getItems()) {

                                        Product product = productRepository
                                                        .findById(
                                                                        item.getProductId())
                                                        .orElse(null);

                                        if (product == null) {
                                                continue;
                                        }

                                        targetMap.put(

                                                        product.getCategory(),

                                                        targetMap.getOrDefault(
                                                                        product.getCategory(),
                                                                        0.0)
                                                                        +
                                                                        item.getFinalPrice()
                                                                                        *
                                                                                        item.getQuantity());
                                }

                        } catch (Exception ignored) {
                        }
                }

                String previousPersonality = determinePersonality(
                                previousCategorySpend);

                String currentPersonality = determinePersonality(
                                currentCategorySpend);

                data.put(
                                "previousPersonality",
                                previousPersonality);

                data.put(
                                "currentPersonality",
                                currentPersonality);

                data.put(
                                "changed",
                                !previousPersonality.equals(
                                                currentPersonality));

                return data;
        }

        private String determinePersonality(
                        Map<String, Double> categorySpend) {

                if (categorySpend.isEmpty()) {

                        return "Balanced Shopper";
                }

                String topCategory = categorySpend.entrySet()
                                .stream()
                                .max(
                                                Map.Entry.comparingByValue())
                                .map(
                                                Map.Entry::getKey)
                                .orElse(
                                                "Balanced Shopper");

                if (topCategory.equalsIgnoreCase(
                                "Electronics")) {

                        return "Tech Enthusiast";
                }

                if (topCategory.equalsIgnoreCase(
                                "Fashion")) {

                        return "Fashion Explorer";
                }

                if (topCategory.equalsIgnoreCase(
                                "Books")) {

                        return "Knowledge Seeker";
                }

                return "Balanced Shopper";
        }

        @GetMapping("/dna-score/{userId}")
        public Map<String, Object> getShoppingDnaScore(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                Map<String, Object> insights = getShoppingInsights(userId);

                List<Order> orders = orderRepository.findByUserId(userId);

                double score = 0;

                List<String> strengths = new ArrayList<>();

                List<String> improvements = new ArrayList<>();

                // ==================================
                // SHOPPING CONSISTENCY (20)
                // ==================================

                double frequency = Double.parseDouble(
                                insights.get(
                                                "shoppingFrequencyDays").toString());

                if (frequency > 0 &&
                                frequency <= 7) {

                        score += 20;

                        strengths.add(
                                        "Highly Consistent Shopping Activity");

                } else if (frequency <= 15) {

                        score += 15;

                        strengths.add(
                                        "Consistent Shopping Activity");

                } else if (frequency <= 30) {

                        score += 10;

                } else {

                        score += 5;

                        improvements.add(
                                        "Shopping pattern is irregular");
                }

                // ==================================
                // SAVINGS (15)
                // ==================================

                double totalSavings = Double.parseDouble(
                                insights.get(
                                                "totalSavings").toString());

                double totalSpent = orders.stream()
                                .filter(order -> !"Cancelled".equals(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .sum();

                if (totalSpent > 0) {

                        double savingPercent = (totalSavings /
                                        totalSpent)
                                        * 100;

                        if (savingPercent >= 10) {

                                score += 15;

                                strengths.add(
                                                "Smart Discount Usage");

                        } else {

                                score += 8;

                                improvements.add(
                                                "Could utilize more discounts");
                        }
                }

                // ==================================
                // BRAND LOYALTY (15)
                // ==================================

                long loyalty = Long.parseLong(
                                insights.get(
                                                "loyaltyPercentage").toString());

                if (loyalty >= 50) {

                        score += 15;

                        strengths.add(
                                        "Strong Brand Loyalty");

                } else {

                        score += 8;

                        improvements.add(
                                        "Brand preferences are still evolving");
                }

                // ==================================
                // CATEGORY DIVERSITY (10)
                // ==================================

                // CATEGORY DIVERSITY (20)

                int diversity = Integer.parseInt(
                                insights.get(
                                                "categoryDiversity").toString());

                if (diversity >= 6) {

                        score += 20;

                        strengths.add(
                                        "Explores Multiple Categories");

                } else if (diversity >= 4) {

                        score += 15;

                        strengths.add(
                                        "Good Category Exploration");

                } else if (diversity >= 3) {

                        score += 10;

                } else if (diversity == 2) {

                        score += 0; // Changed from 5 to make it harder

                        improvements.add(
                                        "Could explore more categories");

                } else {

                        score -= 25; // Heavily penalize single category

                        improvements.add(
                                        "Shopping is concentrated in a single category");
                }

                // ==================================
                // CANCELLATION RATE (15)
                // ==================================

                long cancelled = orders.stream()
                                .filter(order -> "Cancelled"
                                                .equalsIgnoreCase(
                                                                order.getStatus()))
                                .count();

                double cancelRate = orders.isEmpty()
                                ? 0
                                : ((double) cancelled /
                                                orders.size()) * 100;

                if (cancelRate <= 10) {

                        score += 15;

                        strengths.add(
                                        "Low Cancellation Rate");

                } else {

                        score += 5;

                        improvements.add(
                                        "High cancellation activity");
                }

                // ==================================
                // EXCHANGE RATE (10)
                // ==================================

                long exchanged = orders.stream()
                                .filter(order -> "Exchanged"
                                                .equalsIgnoreCase(
                                                                order.getStatus()))
                                .count();

                double exchangeRate = orders.isEmpty()
                                ? 0
                                : ((double) exchanged /
                                                orders.size()) * 100;

                if (exchangeRate <= 10) {

                        score += 10;

                        strengths.add(
                                        "Low Exchange Rate");

                } else {

                        score += 5;

                        improvements.add(
                                        "Frequent exchanges detected");
                }

                // ==================================
                // SPENDING DISCIPLINE (15)
                // ==================================

                double growth = Double.parseDouble(
                                insights.get(
                                                "spendingGrowth").toString());

                if (growth <= 30) {

                        score += 15;

                        strengths.add(
                                        "Controlled Spending Growth");

                } else {

                        score += 5;

                        improvements.add(
                                        "Rapid increase in spending");
                }

                String grade;

                if (score >= 100) {

                        grade = "S";

                } else if (score >= 90) {

                        grade = "A";

                } else if (score >= 75) {

                        grade = "B";

                } else if (score >= 55) {

                        grade = "C";

                } else {

                        grade = "D";
                }

                data.put(
                                "score",
                                Math.round(score));

                data.put(
                                "grade",
                                grade);

                data.put(
                                "strengths",
                                strengths);

                data.put(
                                "improvements",
                                improvements);

                return data;
        }

        @GetMapping("/achievements/{userId}")
        public Map<String, Object> getAchievements(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                List<String> badges = new ArrayList<>();

                List<Order> orders = orderRepository.findByUserId(userId);

                long totalOrders = orders.stream()
                                .filter(order -> !"Cancelled".equalsIgnoreCase(
                                                order.getStatus()))
                                .count();

                double totalSpent = orders.stream()
                                .filter(order -> !"Cancelled".equalsIgnoreCase(
                                                order.getStatus()))
                                .mapToDouble(
                                                Order::getTotalAmount)
                                .sum();

                Map<String, Object> insights = getShoppingInsights(userId);

                Map<String, Object> personality = getPersonalityProfile(userId);

                Map<String, Object> dna = getShoppingDnaScore(userId);

                double savings = Double.parseDouble(
                                insights.get(
                                                "totalSavings").toString());

                int dnaScore = Integer.parseInt(
                                dna.get(
                                                "score").toString());

                // ======================
                // ORDER ACHIEVEMENTS
                // ======================

                if (totalOrders >= 1)
                        badges.add("First Purchase");

                if (totalOrders >= 5)
                        badges.add("5 Orders Club");

                if (totalOrders >= 10)
                        badges.add("10 Orders Club");

                if (totalOrders >= 25)
                        badges.add("25 Orders Club");

                // ======================
                // SPENDING ACHIEVEMENTS
                // ======================

                if (totalSpent >= 10000)
                        badges.add("₹10,000 Club");

                if (totalSpent >= 25000)
                        badges.add("₹25,000 Club");

                if (totalSpent >= 50000)
                        badges.add("₹50,000 Club");

                // ======================
                // SAVINGS ACHIEVEMENTS
                // ======================

                if (savings >= 1000)
                        badges.add("Discount Hunter");

                if (savings >= 5000)
                        badges.add("Budget Master");

                // ======================
                // PERSONALITY BADGES
                // ======================

                List<String> personalities = (List<String>) personality.get(
                                "personalities");

                badges.addAll(personalities);

                // ======================
                // DNA SCORE BADGE
                // ======================

                if (dnaScore >= 90) {

                        badges.add(
                                        "Elite Shopper");
                }

                data.put(
                                "badges",
                                badges);

                data.put(
                                "totalBadges",
                                badges.size());

                return data;
        }

        @GetMapping("/recommendations/{userId}")
        public Map<String, Object> getRecommendations(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                List<String> recommendations = new ArrayList<>();

                Map<String, Object> insights = getShoppingInsights(userId);

                Map<String, Object> personality = getPersonalityProfile(userId);

                Map<String, Object> dna = getShoppingDnaScore(userId);

                Map<String, Object> achievements = getAchievements(userId);

                Map<String, Object> budget = getBudgetAnalytics(userId);

                // ==========================
                // BUDGET RECOMMENDATIONS
                // ==========================

                if (budget.containsKey(
                                "alertLevel")) {

                        String alert = budget.get(
                                        "alertLevel").toString();

                        if ("Warning".equalsIgnoreCase(
                                        alert)) {

                                recommendations.add(
                                                "You are approaching your budget limit. Consider reducing discretionary purchases.");
                        }

                        if ("Critical".equalsIgnoreCase(
                                        alert)) {

                                recommendations.add(
                                                "You have used over 90% of your budget. Review upcoming purchases carefully.");
                        }

                        if ("Exceeded".equalsIgnoreCase(
                                        alert)) {

                                recommendations.add(
                                                "Your budget has been exceeded. Consider pausing non-essential purchases.");
                        }
                }

                // ==========================
                // DNA SCORE
                // ==========================

                int score = Integer.parseInt(
                                dna.get(
                                                "score").toString());

                if (score < 70) {

                        recommendations.add(
                                        "Reducing cancellations and exchanges can significantly improve your Shopping DNA Score.");
                }

                if (score >= 90) {

                        recommendations.add(
                                        "Excellent shopping habits. Maintain your current purchasing discipline.");
                }

                // ==========================
                // SAVINGS
                // ==========================

                double savings = Double.parseDouble(
                                insights.get(
                                                "totalSavings").toString());

                if (savings >= 5000) {

                        recommendations.add(
                                        "You are making excellent use of discounts and offers.");
                }

                // ==========================
                // CATEGORY DIVERSITY
                // ==========================

                int diversity = Integer.parseInt(
                                insights.get(
                                                "categoryDiversity").toString());

                if (diversity <= 2) {

                        recommendations.add(
                                        "You purchase from a limited number of categories. Exploring new categories may uncover useful products.");
                }

                // ==========================
                // PERSONALITY
                // ==========================

                List<String> personalities = (List<String>) personality.get(
                                "personalities");

                if (personalities.contains(
                                "Tech Enthusiast")) {

                        recommendations.add(
                                        "You frequently purchase electronics. Watch for seasonal tech sales to maximize savings.");
                }

                if (personalities.contains(
                                "Fashion Explorer")) {

                        recommendations.add(
                                        "Fashion purchases dominate your shopping habits. Keep an eye on exchange rates to improve your score.");
                }

                // ==========================
                // ACHIEVEMENTS
                // ==========================

                int totalBadges = Integer.parseInt(
                                achievements.get(
                                                "totalBadges").toString());

                if (totalBadges < 5) {

                        recommendations.add(
                                        "Continue shopping responsibly to unlock more achievements and badges.");
                }

                data.put(
                                "recommendations",
                                recommendations);

                return data;
        }

        @PostMapping("/budget")
        public UserBudget saveBudget(
                        @RequestBody UserBudget budget) {

                UserBudget oldBudget = userBudgetRepository
                                .findByUserIdAndActiveTrue(
                                                budget.getUserId());

                if (oldBudget != null) {

                        oldBudget.setActive(false);

                        userBudgetRepository.save(
                                        oldBudget);
                }

                budget.setCreatedAt(
                                LocalDate.now().toString());

                budget.setActive(true);

                return userBudgetRepository.save(
                                budget);
        }

        @GetMapping("/budget/{userId}")
        public Map<String, Object> getBudgetAnalytics(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                UserBudget budget = userBudgetRepository
                                .findByUserIdAndActiveTrue(
                                                userId);

                if (budget == null) {

                        data.put(
                                        "hasBudget",
                                        false);

                        data.put(
                                        "message",
                                        "No budget set");

                        return data;
                }

                List<Order> orders = orderRepository.findByUserId(
                                userId);

                double spent = 0;

                LocalDate today = LocalDate.now();

                LocalDate cycleStart = today;
                LocalDate cycleEnd = today;

                if ("Weekly".equalsIgnoreCase(
                                budget.getBudgetType())) {

                        cycleStart = today.minusDays(
                                        today.getDayOfWeek()
                                                        .getValue() - 1);

                        cycleEnd = cycleStart.plusDays(6);
                } else if ("Monthly".equalsIgnoreCase(
                                budget.getBudgetType())) {

                        cycleStart = today.withDayOfMonth(1);

                        cycleEnd = today.withDayOfMonth(
                                        today.lengthOfMonth());
                } else if ("Yearly".equalsIgnoreCase(
                                budget.getBudgetType())) {

                        cycleStart = today.withDayOfYear(1);

                        cycleEnd = today.withDayOfYear(
                                        today.lengthOfYear());
                }

                for (Order order : orders) {

                        if ("Cancelled".equalsIgnoreCase(
                                        order.getStatus())) {
                                continue;
                        }

                        try {

                                LocalDate orderDate = LocalDate.parse(
                                                order.getDate());

                                boolean includeOrder = false;

                                // =========================
                                // WEEKLY BUDGET
                                // =========================

                                if ("Weekly".equalsIgnoreCase(
                                                budget.getBudgetType())) {

                                        LocalDate startOfWeek = today.minusDays(
                                                        today.getDayOfWeek()
                                                                        .getValue() - 1);

                                        includeOrder = !orderDate.isBefore(
                                                        startOfWeek);
                                }

                                // =========================
                                // MONTHLY BUDGET
                                // =========================

                                else if ("Monthly".equalsIgnoreCase(
                                                budget.getBudgetType())) {

                                        includeOrder = orderDate.getMonth() == today.getMonth()

                                                        &&

                                                        orderDate.getYear() == today.getYear();
                                }

                                // =========================
                                // YEARLY BUDGET
                                // =========================

                                else if ("Yearly".equalsIgnoreCase(
                                                budget.getBudgetType())) {

                                        includeOrder = orderDate.getYear() == today.getYear();
                                }

                                if (includeOrder) {

                                        spent += order.getTotalAmount();
                                }

                        } catch (Exception ignored) {
                        }
                }

                double remaining = budget.getBudgetAmount()
                                - spent;

                double percentUsed = budget.getBudgetAmount() == 0
                                ? 0
                                : (spent
                                                /
                                                budget.getBudgetAmount()) * 100;

                long daysRemaining = java.time.temporal.ChronoUnit.DAYS
                                .between(
                                                today,
                                                cycleEnd);

                String budgetHealth;

                if (percentUsed < 50) {

                        budgetHealth = "Excellent";

                } else if (percentUsed < 75) {

                        budgetHealth = "Good";

                } else if (percentUsed < 90) {

                        budgetHealth = "Warning";

                } else {

                        budgetHealth = "Critical";
                }

                String alertLevel = "Safe";

                if (percentUsed >= 100) {

                        alertLevel = "Exceeded";

                } else if (percentUsed >= 90) {

                        alertLevel = "Critical";

                } else if (percentUsed >= 75) {

                        alertLevel = "Warning";
                }

                data.put(
                                "budgetAmount",
                                budget.getBudgetAmount());

                data.put(
                                "budgetType",
                                budget.getBudgetType());

                data.put(
                                "spent",
                                spent);

                data.put(
                                "remaining",
                                remaining);

                data.put(
                                "percentUsed",
                                Math.round(percentUsed));

                data.put(
                                "alertLevel",
                                alertLevel);

                System.out.println("Budget Amount = " +
                                budget.getBudgetAmount());

                System.out.println("Spent = " +
                                spent);

                System.out.println("Remaining = " +
                                remaining);

                System.out.println("Percent Used = " +
                                percentUsed);

                data.put(
                                "cycleStart",
                                cycleStart.toString());

                data.put(
                                "cycleEnd",
                                cycleEnd.toString());

                data.put(
                                "nextResetDate",
                                cycleEnd.plusDays(1).toString());

                data.put(
                                "daysRemaining",
                                daysRemaining);

                data.put(
                                "budgetHealth",
                                budgetHealth);

                data.put(
                                "hasBudget",
                                true);

                return data;
        }

        @DeleteMapping("/budget/{userId}")
        public Map<String, Object> removeBudget(
                        @PathVariable Long userId) {

                Map<String, Object> response = new HashMap<>();

                UserBudget budget = userBudgetRepository
                                .findByUserIdAndActiveTrue(
                                                userId);

                if (budget == null) {

                        response.put(
                                        "success",
                                        false);

                        response.put(
                                        "message",
                                        "No active budget found");

                        return response;
                }

                budget.setActive(false);

                userBudgetRepository.save(
                                budget);

                response.put(
                                "success",
                                true);

                response.put(
                                "message",
                                "Budget removed successfully");

                return response;
        }

        @GetMapping("/budget-checkout/{userId}")
        public Map<String, Object> analyzeCheckoutBudget(
                        @PathVariable Long userId) {

                Map<String, Object> data = new HashMap<>();

                UserBudget budget = userBudgetRepository
                                .findByUserIdAndActiveTrue(
                                                userId);

                if (budget == null) {

                        data.put(
                                        "hasBudget",
                                        false);

                        data.put(
                                        "message",
                                        "No budget set");

                        return data;
                }

                Map<String, Object> budgetData = getBudgetAnalytics(userId);

                double currentSpent = ((Number) budgetData.get("spent"))
                                .doubleValue();

                List<Cart> cartItems = cartRepository.findByUserId(
                                userId);

                double cartTotal = 0;

                List<Map<String, Object>> suggestions = new ArrayList<>();

                for (Cart cart : cartItems) {

                        Product product = productRepository
                                        .findById(
                                                        cart.getProductId())
                                        .orElse(null);

                        if (product == null) {
                                continue;
                        }

                        cartTotal += product.getPrice()
                                        *
                                        cart.getQuantity();
                }

                double projectedSpend = currentSpent + cartTotal;

                boolean exceedsBudget = projectedSpend > budget.getBudgetAmount();

                double overBy = Math.max(
                                0,
                                projectedSpend
                                                -
                                                budget.getBudgetAmount());

                if (exceedsBudget) {

                        List<Map<String, Object>> removableProducts = new ArrayList<>();

                        for (Cart cart : cartItems) {

                                Product product = productRepository
                                                .findById(
                                                                cart.getProductId())
                                                .orElse(null);

                                if (product == null) {
                                        continue;
                                }

                                double itemTotal = product.getPrice()
                                                *
                                                cart.getQuantity();

                                if (projectedSpend
                                                -
                                                itemTotal <= budget.getBudgetAmount()) {

                                        Map<String, Object> item = new HashMap<>();

                                        item.put(
                                                        "productName",
                                                        product.getName());

                                        item.put(
                                                        "price",
                                                        itemTotal);

                                        removableProducts.add(
                                                        item);
                                }
                        }

                        suggestions = removableProducts;
                }

                data.put(
                                "budgetAmount",
                                budget.getBudgetAmount());

                data.put(
                                "currentSpent",
                                currentSpent);

                data.put(
                                "cartTotal",
                                cartTotal);

                data.put(
                                "projectedSpend",
                                projectedSpend);

                data.put(
                                "exceedsBudget",
                                exceedsBudget);

                data.put(
                                "overBy",
                                overBy);

                data.put(
                                "suggestions",
                                suggestions);

                return data;
        }

        @GetMapping("/intelligence-dashboard/{userId}")
        public Map<String, Object> getShoppingIntelligenceDashboard(
                        @PathVariable Long userId) {

                Map<String, Object> dashboard = new HashMap<>();

                dashboard.put(
                                "expenseTracker",
                                getExpenseTracker(userId));

                dashboard.put(
                                "shoppingInsights",
                                getShoppingInsights(userId));

                dashboard.put(
                                "personality",
                                getPersonalityProfile(userId));

                dashboard.put(
                                "personalityEvolution",
                                getPersonalityEvolution(userId));

                dashboard.put(
                                "dnaScore",
                                getShoppingDnaScore(userId));

                dashboard.put(
                                "achievements",
                                getAchievements(userId));

                dashboard.put(
                                "budget",
                                getBudgetAnalytics(userId));

                dashboard.put(
                                "recommendations",
                                getRecommendations(userId));

                return dashboard;
        }

        @GetMapping("/rewards/{userId}")
        public List<UserReward> getRewards(
                        @PathVariable Long userId) {

                return userRewardRepository.findByUserId(userId);
        }

        @PostMapping("/category-budget")
        public CategoryBudget saveCategoryBudget(
                        @RequestBody CategoryBudget budget) {

                List<String> allowedBudgetTypes = Arrays.asList(
                                "Weekly",
                                "Monthly",
                                "Yearly");

                if (budget.getBudgetType() == null
                                ||
                                !allowedBudgetTypes.contains(
                                                budget.getBudgetType())) {

                        throw new RuntimeException(
                                        "Invalid budget type");
                }

                List<String> allowedCategories = Arrays.asList(
                                "Fashion",
                                "Electronics",
                                "Books",
                                "Beauty",
                                "Home & Kitchen",
                                "Sports",
                                "Accessories");

                if (budget.getCategory() == null
                                ||
                                !allowedCategories.contains(
                                                budget.getCategory())) {

                        throw new RuntimeException(
                                        "Invalid category selected");
                }

                CategoryBudget existing = categoryBudgetRepository
                                .findByUserIdAndCategoryAndActiveTrue(
                                                budget.getUserId(),
                                                budget.getCategory());

                if (existing != null) {

                        existing.setActive(false);

                        categoryBudgetRepository.save(
                                        existing);

                }

                return categoryBudgetRepository.save(
                                budget);
        }

        @GetMapping("/category-budget/{userId}")
        public List<Map<String, Object>> getCategoryBudgetAnalytics(
                        @PathVariable Long userId) {
                LocalDate today = LocalDate.now();

                LocalDate cycleStart;

                List<Map<String, Object>> response = new ArrayList<>();

                List<CategoryBudget> budgets = categoryBudgetRepository
                                .findByUserIdAndActiveTrue(
                                                userId);

                List<Order> orders = orderRepository.findByUserId(
                                userId);

                for (CategoryBudget budget : budgets) {

                        double spent = 0;

                        if ("Weekly".equalsIgnoreCase(
                                        budget.getBudgetType())) {

                                cycleStart = today.minusDays(
                                                today.getDayOfWeek()
                                                                .getValue() - 1);

                        } else if ("Monthly".equalsIgnoreCase(
                                        budget.getBudgetType())) {

                                cycleStart = today.withDayOfMonth(1);

                        } else {

                                cycleStart = today.withDayOfYear(1);
                        }

                        for (Order order : orders) {

                                if ("Cancelled".equalsIgnoreCase(
                                                order.getStatus())) {
                                        continue;
                                }

                                try {

                                        LocalDate orderDate = LocalDate.parse(
                                                        order.getDate());

                                        if (orderDate.isBefore(
                                                        cycleStart)) {

                                                continue;
                                        }

                                } catch (Exception ignored) {

                                        continue;
                                }

                                for (OrderItem item : order.getItems()) {

                                        Product product = productRepository
                                                        .findById(
                                                                        item.getProductId())
                                                        .orElse(null);

                                        if (product == null) {
                                                continue;
                                        }

                                        if (budget.getCategory()
                                                        .equalsIgnoreCase(
                                                                        product.getCategory())) {

                                                double itemAmount = item.getFinalPrice()
                                                                * item.getQuantity();

                                                System.out.println(
                                                                "BUDGET DEBUG -> "
                                                                                + product.getName()
                                                                                + " | Category="
                                                                                + product.getCategory()
                                                                                + " | Amount="
                                                                                + itemAmount);

                                                spent += itemAmount;
                                        }
                                }
                        }

                        double remaining = budget.getBudgetAmount()
                                        - spent;

                        double percentUsed = budget.getBudgetAmount() == 0
                                        ? 0
                                        : (spent
                                                        /
                                                        budget.getBudgetAmount()) * 100;

                        String status = "Safe";

                        if (percentUsed >= 100) {

                                status = "Exceeded";

                        } else if (percentUsed >= 90) {

                                status = "Critical";

                        } else if (percentUsed >= 75) {

                                status = "Warning";
                        }

                        Map<String, Object> row = new HashMap<>();

                        row.put(
                                        "category",
                                        budget.getCategory());

                        row.put(
                                        "budgetAmount",
                                        budget.getBudgetAmount());

                        row.put(
                                        "budgetType",
                                        budget.getBudgetType());

                        row.put(
                                        "spent",
                                        spent);

                        row.put(
                                        "remaining",
                                        remaining);

                        row.put(
                                        "percentUsed",
                                        Math.round(percentUsed));

                        row.put(
                                        "status",
                                        status);

                        response.add(row);
                }

                return response;
        }

        @DeleteMapping("/category-budget/{userId}/{category}")
        public Map<String, Object> removeCategoryBudget(
                        @PathVariable Long userId,
                        @PathVariable String category) {

                Map<String, Object> response = new HashMap<>();

                CategoryBudget budget = categoryBudgetRepository
                                .findByUserIdAndCategoryAndActiveTrue(
                                                userId,
                                                category);

                if (budget == null) {

                        response.put(
                                        "success",
                                        false);

                        return response;
                }

                budget.setActive(false);

                categoryBudgetRepository.save(
                                budget);

                response.put(
                                "success",
                                true);

                return response;
        }

        @GetMapping("/admin/monthly-registrations")
        public List<Map<String, Object>> getMonthlyRegistrations() {

                List<Map<String, Object>> response =
                        new ArrayList<>();

                List<User> users =
                        userRepository.findAll();

                Map<Integer, Integer> monthlyCounts =
                        new HashMap<>();

                for (int i = 1; i <= 12; i++) {

                        monthlyCounts.put(
                                i,
                                0
                        );
                }

                for (User user : users) {

                        if (user.getRegistrationDate() == null) {
                                continue;
                        }

                        int month =
                                user.getRegistrationDate()
                                        .getMonthValue();

                        monthlyCounts.put(
                                month,
                                monthlyCounts.get(month) + 1
                        );
                }

                for (int i = 1; i <= 12; i++) {

                        Map<String, Object> row =
                                new HashMap<>();

                        row.put(
                                "month",
                                Month.of(i).name()
                        );

                        row.put(
                                "count",
                                monthlyCounts.get(i)
                        );

                        response.add(row);
                }

                return response;
        }

        @GetMapping("/admin/user-summary")
        public Map<String, Object> getUserSummary() {

                Map<String, Object> response =
                        new HashMap<>();

                List<User> users =
                        userRepository.findAll();

                int totalUsers =
                        users.size();

                int thisMonthUsers = 0;

                LocalDate today =
                        LocalDate.now();

                for (User user : users) {

                        if (user.getRegistrationDate() == null) {
                                continue;
                        }

                        if (
                                user.getRegistrationDate()
                                        .getMonthValue()
                                        ==
                                        today.getMonthValue()
                                        &&
                                        user.getRegistrationDate()
                                                .getYear()
                                                ==
                                                today.getYear()
                        ) {

                                thisMonthUsers++;
                        }
                }

                response.put(
                        "totalUsers",
                        totalUsers
                );

                response.put(
                        "thisMonthUsers",
                        thisMonthUsers
                );

                return response;
        }
}