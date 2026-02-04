package com.quotation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    private Long employeeId;
    
    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;
    
    private Boolean gstEnabled = false;
    private String notes;
}
