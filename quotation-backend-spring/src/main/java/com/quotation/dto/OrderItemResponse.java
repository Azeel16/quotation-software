package com.quotation.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long itemId;
    private String itemName;
    private Integer quantity;
    private BigDecimal price;
    private String unit;
    private BigDecimal total;
}
