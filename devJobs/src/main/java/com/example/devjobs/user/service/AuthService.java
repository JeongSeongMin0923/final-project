package com.example.devjobs.user.service;

import com.example.devjobs.user.dto.request.auth.*;
import com.example.devjobs.user.dto.response.ResponseDto;
import com.example.devjobs.user.dto.response.auth.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super IdCheckResponseDto> idCheck (IdCheckRequestDto dto);
    ResponseEntity<? super EmailCheckResponseDto> emailCheck (EmailCheckRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification (EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification (CheckCertificationRequestDto dto);
    ResponseEntity<? super SignUpResponseDto> signUp (SignUpRequestDto dto);
    ResponseEntity<ResponseDto> signIn(SignInRequestDto dto);
    UserInfoResponseDto getUserInfo(String token);

}