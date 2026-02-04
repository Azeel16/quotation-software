package com.quotation.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmployeeResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String position;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
