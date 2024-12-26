package com.example.devjobs.user.dto.response.auth;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String name;
    private String email;
    private String userId;
    private String type;

    // 기업 회원 관련 데이터
    private String companyCode;
    private String companyType;
    private String companyName;
    private String ceoName;
    private String companyAddress;

    // 일반 회원 생성자
    public UserResponseDto(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.userId = user.getUserId();
        this.type = user.getType();
    }

    // 기업 회원 생성자 (CompanyProfile 포함)
    public UserResponseDto(User user, CompanyProfile companyProfile) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.userId = user.getUserId();
        this.type = user.getType();

        // 기업 회원일 경우 CompanyProfile 데이터 추가
        if (companyProfile != null) {
            this.companyCode = companyProfile.getCompanyCode();
            this.companyType = companyProfile.getCompanyType();
            this.companyName = companyProfile.getCompanyName();
            this.ceoName = companyProfile.getCeoName();
            this.companyAddress = companyProfile.getCompanyAddress();
        }
    }
}
