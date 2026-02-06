package com.quotation.dto;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;

    // Constructor with type parameter
    public JwtResponse(String token, String type, String email, String name) {
        this.token = token;
        this.type = type;
        this.email = email;
        this.name = name;
    }
    
    // Convenience constructor that defaults type to "Bearer"
    public JwtResponse(String token, String email, String name) {
        this.token = token;
        this.type = "Bearer";
        this.email = email;
        this.name = name;
    }
}
