package com.example.devjobs.user.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    private String userId;

    private String userCode;

    private String name;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$")
    private String password;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String certificationNumber;

    private String type; // 회원가입 유형(일반회원가입 "dev" , 소셜회원가입 "kakao", "naver")


    // 기업회원일 경우
    private String companyDescription; // 기업 설명

    private String industry;    // 기업 업종

    private String websiteUrl;  // 기업 홈페이지 경로

    private String companyCode; // 사업자 등록번호

    private String companyType; // 기업형태

    private String companyName; // 회사 이름

    private String ceoName;     // 대표 이름

    private String companyAddress; // 회사 주소

    private String uploadFileName;


}