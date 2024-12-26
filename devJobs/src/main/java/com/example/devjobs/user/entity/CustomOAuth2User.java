package com.example.devjobs.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class CustomOAuth2User implements OAuth2User {

    private String userCode;
//    private String userId;
    private String email;
    private String name;
    private String type;

    // 생성자 수정: userId, email, name, type 모두 받도록
//    public CustomOAuth2User(String userCode, String userId, String email, String name, String type) {
//        this.userCode = userCode;
//        this.userId = userId;
//        this.email = email;
//        this.name = name;
//        this.type = type;
//    }

    public CustomOAuth2User(String userCode, String email, String name, String type) {
        this.userCode = userCode;
        this.email = email;
        this.name = name;
        this.type = type;
    }

    @Override
    public Map<String, Object> getAttributes() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("userCode", userCode);
        attributes.put("email", email);
        attributes.put("name", name);
        attributes.put("type", type);
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;  // 권한 추가 필요 시 수정
    }

    @Override
    public String getName() {
        return this.name;  // userId를 이름으로 사용
    }
}