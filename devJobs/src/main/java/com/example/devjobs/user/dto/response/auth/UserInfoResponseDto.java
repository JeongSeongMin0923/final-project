package com.example.devjobs.user.dto.response.auth;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDto {

    // 사용자 정보
    private String name;
    private String userType;
    private String email;
    private String userId;

    // 회사 정보
    private String companyCode;
    private String companyType;
    private String companyName;
    private String ceoName;
    private String companyAddress;

    // 사용자만 존재하는 경우
    public UserInfoResponseDto(String name, String userType, String email, String userId) {
        this.name = name;
        this.userType = userType;
        this.email = email;
        this.userId = userId;
    }

    // 사용자 + 회사 정보가 있는 경우
    public static UserInfoResponseDto fromUserAndCompany(User user, CompanyProfile companyProfile) {
        if (companyProfile == null) {
            return new UserInfoResponseDto(
                    user.getName(),
                    user.getType(),
                    user.getEmail(),
                    user.getUserId()
            );
        }
        return new UserInfoResponseDto(
                user.getName(),
                user.getType(),
                user.getEmail(),
                user.getUserId(),
                companyProfile.getCompanyCode(),
                companyProfile.getCompanyType(),
                companyProfile.getCompanyName(),
                companyProfile.getCeoName(),
                companyProfile.getCompanyAddress()
        );
    }
}

