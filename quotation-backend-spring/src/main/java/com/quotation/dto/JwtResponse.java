package com.quotation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;

    public JwtResponse(String token, String email, String name) {
        this.token = token;
        this.email = email;
        this.name = name;
    }
}
