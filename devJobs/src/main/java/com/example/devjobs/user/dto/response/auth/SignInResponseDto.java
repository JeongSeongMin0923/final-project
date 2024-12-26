package com.example.devjobs.user.dto.response.auth;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.user.common.ResponseCode;
import com.example.devjobs.user.common.ResponseMessage;
import com.example.devjobs.user.dto.response.ResponseDto;
import com.example.devjobs.user.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
public class SignInResponseDto extends ResponseDto {

    private String token;
    private int expirationTime;
    private String userCode;
    private String userId;
    private String type;  // dev_id, kakao_id, naver_id 등
    private String name;
    private String email;

    // 기업 회원 데이터 추가
    private String companyCode;
    private String companyType;
    private String companyName;
    private String ceoName;
    private String companyAddress;

    // 성공 응답 메서드: 일반 회원
    public static SignInResponseDto success(String token, User user) {
        SignInResponseDto responseDto = new SignInResponseDto();
        responseDto.setToken(token);
        responseDto.setExpirationTime(3600);  // 예: 1시간 만료
        responseDto.setUserId(user.getUserId());
        responseDto.setUserCode(user.getUserCode());
        responseDto.setType(user.getType());  // 사용자 유형 (소셜/일반)
        responseDto.setName(user.getName());
        responseDto.setEmail(user.getEmail());
        return responseDto;
    }

    // 성공 응답 메서드: 기업 회원
    public static SignInResponseDto companySuccess(String token, User user, CompanyProfile companyProfile) {
        SignInResponseDto responseDto = success(token, user);

        // 기업 회원 데이터 설정
        if (companyProfile != null) {
            responseDto.setCompanyCode(companyProfile.getCompanyCode());
            responseDto.setCompanyType(companyProfile.getCompanyType());
            responseDto.setCompanyName(companyProfile.getCompanyName());
            responseDto.setCeoName(companyProfile.getCeoName());
            responseDto.setCompanyAddress(companyProfile.getCompanyAddress());
        }
        return responseDto;
    }

    // 로그인 실패 응답 메서드
    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.SIGN_IN_FAIL, ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
    }
}
