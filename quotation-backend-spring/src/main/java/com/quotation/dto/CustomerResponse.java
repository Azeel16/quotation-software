package com.quotation.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerResponse {
    private Long id;
    private String name;
    private String phone;
    private String gst;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
