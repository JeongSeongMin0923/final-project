package com.example.devjobs.user.dto.response.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OAuth2CallbackResponse {
    private String token;
    private long expirationTime;
    private String userCode;
    private String email;
    private String name;
    private String type;

    public OAuth2CallbackResponse(String token, long expirationTime, String userCode, String email, String name, String type) {
        this.token = token;
        this.expirationTime = expirationTime;
        this.userCode = userCode;
        this.email = email;
        this.name = name;
        this.type = type;
    }

    @Override
    public String toString() {
        return "OAuth2CallbackResponse{" +
                "token='" + token + '\'' +
                ", expirationTime=" + expirationTime +
                ", userCode='" + userCode + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}