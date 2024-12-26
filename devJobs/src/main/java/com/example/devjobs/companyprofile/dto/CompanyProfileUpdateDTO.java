package com.example.devjobs.companyprofile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileUpdateDTO {

    private Integer companyProfileCode; // 기업 프로필 코드 (필수)

    private String companyName; // 회사 이름 (필수)

    private String companyType; // 기업 형태 (필수)

    private String ceoName; // 대표 이름 (필수)

    private String companyAddress; // 회사 주소 (필수)

    private String companyDescription; // 회사 설명 (옵션)

    private String industry; // 업종 (옵션)

    private String websiteUrl; // 웹사이트 (옵션)
}
