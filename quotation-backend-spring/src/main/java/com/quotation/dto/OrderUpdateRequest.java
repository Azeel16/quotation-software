package com.quotation.dto;

import com.quotation.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderUpdateRequest {
    
    @NotNull(message = "Status is required")
    private Order.OrderStatus status;
    
    private String notes;
}
