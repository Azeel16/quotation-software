package com.quotation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    
    @NotBlank(message = "Customer name is required")
    private String name;
    
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    private String gst;
    private String address;
}
