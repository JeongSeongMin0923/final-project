package com.example.devjobs.companyprofile.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileDTO {

    private Integer companyProfileCode; // 기업 프로필 코드

    private String companyDescription; // 기업 설명

    private String industry; // 업종

    private String websiteUrl; // 회사 웹사이트 URL

    private String companyCode; // 사업자 등록번호

    private String companyType; // 기업 형태 (중소기업, 중견기업 등)

    private String companyName; // 회사 이름

    private String ceoName; // 대표 이름

    private String companyAddress; // 회사 주소

    private String userCode; // 연결된 사용자 코드

    private String uploadFileName; // 로고 파일 이름 (업로드된 파일 이름)

    private String createDate; // 생성일 (포맷팅된 값, 필요 시)

    private String updateDate; // 수정일 (포맷팅된 값, 필요 시)

    public CompanyProfileDTO(String companyName, String companyDescription, String industry, String websiteUrl, String ceoName) {
        this.companyName = companyName;
        this.companyDescription = companyDescription;
        this.industry = industry;
        this.websiteUrl = websiteUrl;
        this.ceoName = ceoName;
    }


}
