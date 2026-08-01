package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.repository.OrderRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/orders/excel")
    public ResponseEntity<byte[]>
    exportOrdersExcel() {

        try {

            Workbook workbook =
                    new XSSFWorkbook();

            Sheet sheet =
                    workbook.createSheet(
                            "Orders"
                    );

            Row header =
                    sheet.createRow(0);

            header.createCell(0)
                    .setCellValue(
                            "Order ID"
                    );

            header.createCell(1)
                    .setCellValue(
                            "User ID"
                    );

            header.createCell(2)
                    .setCellValue(
                            "Date"
                    );

            header.createCell(3)
                    .setCellValue(
                            "Status"
                    );

            header.createCell(4)
                    .setCellValue(
                            "Amount"
                    );

            List<Order> orders =
                    orderRepository.findAll();

            int rowNum = 1;

            for(Order order :
                    orders) {

                Row row =
                        sheet.createRow(
                                rowNum++
                        );

                row.createCell(0)
                        .setCellValue(
                                order.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                order.getUserId()
                        );

                row.createCell(2)
                        .setCellValue(
                                order.getDate()
                        );

                row.createCell(3)
                        .setCellValue(
                                order.getStatus()
                        );

                row.createCell(4)
                        .setCellValue(
                                order.getTotalAmount()
                        );
            }

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            workbook.write(out);

            workbook.close();

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentDisposition(
                    ContentDisposition
                            .attachment()
                            .filename(
                                    "Orders_Report.xlsx"
                            )
                            .build()
            );

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(
                            out.toByteArray()
                    );

        } catch(Exception e) {

            throw new RuntimeException(
                    e.getMessage()
            );
        }
    }

    @GetMapping("/inventory/excel")
    public ResponseEntity<byte[]>
    exportInventoryExcel() {

        try {

            Workbook workbook =
                    new XSSFWorkbook();

            Sheet sheet =
                    workbook.createSheet(
                            "Inventory"
                    );

            Row header =
                    sheet.createRow(0);

            header.createCell(0)
                    .setCellValue("Product");

            header.createCell(1)
                    .setCellValue("Category");

            header.createCell(2)
                    .setCellValue("Stock");

            header.createCell(3)
                    .setCellValue("Sales Count");

            List<Product> products =
                    productRepository.findAll();

            int rowNum = 1;

            for(Product product :
                    products) {

                Row row =
                        sheet.createRow(
                                rowNum++
                        );

                row.createCell(0)
                        .setCellValue(
                                product.getName()
                        );

                row.createCell(1)
                        .setCellValue(
                                product.getCategory()
                        );

                row.createCell(2)
                        .setCellValue(
                                product.getStockQuantity()
                        );

                row.createCell(3)
                        .setCellValue(
                                product.getSalesCount()
                        );
            }

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            workbook.write(out);

            workbook.close();

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentDisposition(
                    ContentDisposition
                            .attachment()
                            .filename(
                                    "Inventory_Report.xlsx"
                            )
                            .build()
            );

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(
                            out.toByteArray()
                    );

        } catch(Exception e) {

            throw new RuntimeException(
                    e.getMessage()
            );
        }
    }

    @GetMapping("/revenue/excel")
    public ResponseEntity<byte[]>
    exportRevenueExcel() {

        try {

            Workbook workbook =
                    new XSSFWorkbook();

            Sheet sheet =
                    workbook.createSheet(
                            "Revenue"
                    );

            Row header =
                    sheet.createRow(0);

            header.createCell(0)
                    .setCellValue("Month");

            header.createCell(1)
                    .setCellValue("Revenue");

            List<Order> orders =
                    orderRepository.findAll();

            Map<String, Double> revenueMap =
                    new HashMap<>();

            for(Order order :
                    orders) {

                if(
                        "Cancelled".equals(
                                order.getStatus()
                        )
                ) {
                    continue;
                }

                String month =
                        order.getDate()
                                .substring(
                                        0,
                                        7
                                );

                revenueMap.put(

                        month,

                        revenueMap.getOrDefault(
                                month,
                                0.0
                        )
                                +
                                order.getTotalAmount()
                );
            }

            int rowNum = 1;

            for(Map.Entry<String, Double> entry :
                    revenueMap.entrySet()) {

                Row row =
                        sheet.createRow(
                                rowNum++
                        );

                row.createCell(0)
                        .setCellValue(
                                entry.getKey()
                        );

                row.createCell(1)
                        .setCellValue(
                                entry.getValue()
                        );
            }

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            workbook.write(out);

            workbook.close();

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentDisposition(
                    ContentDisposition
                            .attachment()
                            .filename(
                                    "Revenue_Report.xlsx"
                            )
                            .build()
            );

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(
                            out.toByteArray()
                    );

        } catch(Exception e) {

            throw new RuntimeException(
                    e.getMessage()
            );
        }
    }
}