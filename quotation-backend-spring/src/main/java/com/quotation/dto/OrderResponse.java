package com.quotation.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private Long employeeId;
    private String employeeName;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private Boolean gstEnabled;
    private BigDecimal gstAmount;
    private Integer gstRate;
    private BigDecimal total;
    private String status;
    private LocalDate billingDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
