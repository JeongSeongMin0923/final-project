package com.example.devjobs.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private String userId;
    private String name;
    private String email;
    private String role;
}
