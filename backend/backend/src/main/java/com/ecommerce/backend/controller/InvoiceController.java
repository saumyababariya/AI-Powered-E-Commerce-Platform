package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.repository.OrderRepository;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.itextpdf.text.Font;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/invoice")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/{orderId}")
    public ResponseEntity<byte[]> generateInvoice(
            @PathVariable Long orderId
    ) {

        try {

            Order order =
                    orderRepository.findById(orderId)
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Order not found"
                                    )
                            );

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            // =========================
// COMPANY HEADER
// =========================

            Font titleFont =
                    new Font(
                            Font.FontFamily.HELVETICA,
                            22,
                            Font.BOLD
                    );

            Paragraph company =
                    new Paragraph(
                            "TRENDY THREADS",
                            titleFont
                    );

            company.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(company);

            Font subTitleFont =
                    new Font(
                            Font.FontFamily.HELVETICA,
                            12,
                            Font.BOLD
                    );

            Paragraph invoiceTitle =
                    new Paragraph(
                            "TAX INVOICE",
                            subTitleFont
                    );

            invoiceTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(invoiceTitle);

            document.add(
                    new Paragraph(" ")
            );

// =========================
// ORDER DETAILS
// =========================

            document.add(
                    new Paragraph(
                            "Invoice No : INV-" +
                                    order.getId()
                    )
            );

            document.add(
                    new Paragraph(
                            "Order ID : " +
                                    order.getId()
                    )
            );

            document.add(
                    new Paragraph(
                            "Date : " +
                                    order.getDate()
                    )
            );

            document.add(
                    new Paragraph(
                            "Status : " +
                                    order.getStatus()
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

// =========================
// PRODUCT TABLE
// =========================

            PdfPTable table =
                    new PdfPTable(4);

            table.setWidthPercentage(100);

            table.addCell("Product");
            table.addCell("Qty");
            table.addCell("Price");
            table.addCell("Amount");

            for(OrderItem item :
                    order.getItems()) {

                table.addCell(
                        item.getName()
                );

                table.addCell(
                        String.valueOf(
                                item.getQuantity()
                        )
                );

                table.addCell(
                        "₹" + item.getPrice()
                );

                table.addCell(
                        "₹" +
                                (item.getFinalPrice() * item.getQuantity())
                );
            }

            document.add(table);

            document.add(
                    new Paragraph(" ")
            );

// =========================
// TOTALS
// =========================

            document.add(
                    new Paragraph(
                            "Total Amount : ₹" +
                                    order.getTotalAmount()
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

// =========================
// FOOTER
// =========================

            Paragraph footer =
                    new Paragraph(
                            "Thank you for shopping with TRENDY THREADS."
                    );

            footer.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(footer);

            document.close();

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_PDF
            );

            headers.setContentDisposition(
                    ContentDisposition
                            .attachment()
                            .filename(
                                    "Invoice_" +
                                            orderId +
                                            ".pdf"
                            )
                            .build()
            );

            return new ResponseEntity<>(
                    out.toByteArray(),
                    headers,
                    HttpStatus.OK
            );

        } catch(Exception e) {

            throw new RuntimeException(
                    e.getMessage()
            );
        }
    }
}