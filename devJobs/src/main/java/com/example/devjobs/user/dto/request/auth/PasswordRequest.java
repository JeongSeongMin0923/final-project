package com.example.devjobs.user.dto.request.auth;

import lombok.Data;

@Data
public class PasswordRequest {
    private String password; // 클라이언트에서 입력한 비밀번호를 받는 필드
}
