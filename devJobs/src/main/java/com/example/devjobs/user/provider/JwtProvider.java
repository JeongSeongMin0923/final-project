package com.example.devjobs.user.provider;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    // JWT 생성 메소드
    // JwtProvider 클래스 내 create 메서드 수정
    public String create(String userId, String role, String userCode) {
        Date expiredDate = Date.from(Instant.now().plus(24*7, ChronoUnit.HOURS));
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        JwtBuilder builder = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)
                .setSubject(userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(expiredDate);

        if (userCode != null && !userCode.isEmpty()) {
            builder.claim("userCode", userCode);
        }
        String jwt = builder.compact();

        System.out.println("Generated JWT: " + jwt); // 생성된 JWT를 로그로 출력
        return jwt;
    }


    // JWT 검증 메소드
    public String validate(String jwt) {

        if (jwt == null || jwt.isEmpty() || jwt.split("\\.").length != 3) {
            throw new MalformedJwtException("유효하지 않은 JWT 형식입니다.");
        }

        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        // 로그로 디버깅 추가
        System.out.println("Decoded Claims: " + claims);

        String userCode = claims.get("userCode", String.class);
        String userId = claims.getSubject(); // 일반 회원의 경우 userId는 subject에 저장됨

        // 소셜 회원은 userCode, 일반 회원은 userId 반환
        if (userCode != null && (userCode.startsWith("kakao_") || userCode.startsWith("naver_"))) {
            return userCode; // 소셜 회원
        } else if (userId != null) {
            return userId; // 일반 회원
        } else {
            throw new IllegalArgumentException("JWT에 userCode나 userId가 없습니다.");
        }
    }


    // JWT에서 클레임을 가져오는 메소드 (예: 만료 시간)
    public Claims getClaims(String jwt) {
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)  // JWT 파싱
                    .getBody();  // 클레임 반환
        } catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
    }

    public String getUserIdFromToken(String jwt) {
        Claims claims = getClaims(jwt);
        if (claims != null) {
            return claims.getSubject(); // Subject는 userId로 설정됨
        }
        throw new IllegalArgumentException("JWT에 userId가 포함되어 있지 않습니다.");
    }

}