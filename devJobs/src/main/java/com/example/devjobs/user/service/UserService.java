package com.example.devjobs.user.service;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.user.dto.UserDTO;
import com.example.devjobs.user.dto.request.auth.UpdateUserRequestDto;
import com.example.devjobs.user.dto.response.auth.UserResponseDto;
import com.example.devjobs.user.entity.User;
import java.util.List;

public interface UserService {

    void deleteUserByCode(String userCode); // 사용자 조회

    void updatePassword(String userId, String currentPassword, String newPassword); // 비밀번호 변경

    boolean checkUserPassword(String userId, String password);

    CompanyProfile getUserCompanyProfile(String userCode);

    Integer getCompanyProfileCodeByUserCode(String userCode);

    // 유저아이디로 유저정보를 조회
    User getUserId(String userId);

    List<UserDTO> getAllUsers();
}

