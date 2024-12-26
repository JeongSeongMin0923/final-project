package com.example.devjobs.user.dto.request.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDto {
    private String name;
    private String password;
    private String email;

    // 기업 회원 정보
    private String companyCode;
    private String companyName;
    private String companyType;
    private String ceoName;
    private String companyAddress;
}