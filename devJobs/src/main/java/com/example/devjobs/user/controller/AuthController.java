package com.example.devjobs.user.controller;

import com.example.devjobs.user.dto.request.auth.*;
import com.example.devjobs.user.dto.response.ResponseDto;
import com.example.devjobs.user.dto.response.auth.*;
import com.example.devjobs.user.service.AuthService;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(@RequestBody @Valid IdCheckRequestDto requestBody) {
        ResponseEntity<? super IdCheckResponseDto> response = authService.idCheck(requestBody);
        return response;
    }

    @PostMapping("/email-check")
    public ResponseEntity<? super EmailCheckResponseDto> emailCheck(@RequestBody @Valid EmailCheckRequestDto requestDto) {
        return authService.emailCheck(requestDto);
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(@RequestBody @Valid EmailCertificationRequestDto requestBody) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(@RequestBody @Valid CheckCertificationRequestDto requestBody) {
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(@RequestBody @Valid SignUpRequestDto requestBody) {
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<ResponseDto> signIn(@RequestBody @Valid SignInRequestDto requestBody) {
        return authService.signIn(requestBody);
    }

    @GetMapping("/oauth-response")
    public ResponseEntity<SignInResponseDto> oauthResponse(
            @RequestParam String token,
            @RequestParam String userCode,
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String type) {

        // OAuth2 인증 후 받은 데이터로 SignInResponseDto 생성
        SignInResponseDto response = new SignInResponseDto();
        response.setToken(token);
        response.setExpirationTime(3600);
        response.setUserCode(userCode);
        response.setEmail(email);
        response.setName(name);
        response.setType(type);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            UserInfoResponseDto userInfo = authService.getUserInfo(token);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token or unauthorized request");
        }
    }

}
