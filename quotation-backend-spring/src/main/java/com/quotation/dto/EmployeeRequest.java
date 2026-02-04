package com.quotation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeRequest {
    
    @NotBlank(message = "Employee name is required")
    private String name;
    
    private String phone;
    private String email;
    private String position;
    private Boolean isActive = true;
}
