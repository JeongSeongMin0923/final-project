package com.example.devjobs.companyprofile.service;

import com.example.devjobs.apply.dto.ApplyDTO;
import com.example.devjobs.companyprofile.dto.CompanyProfileDTO;
import com.example.devjobs.companyprofile.dto.CompanyProfileUpdateDTO;
import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public interface CompanyProfileService {

    int register(CompanyProfileDTO dto, MultipartFile logoFile);

    List<CompanyProfileDTO> getList();

    CompanyProfileDTO read(int code);

    void modify(CompanyProfileUpdateDTO updateDTO);

    void remove(int code);

    int getCurrentCompanyProfileCode();

    List<ApplyDTO> getApplicantsByCompanyProfile(Integer companyProfileCode);

    // 회사 정보 내 채용공고 확인(유저)
    List<JobPostingDTO> getJobPostingsByCompanyProfileCode(Integer companyProfileCode);

    // 기업페이지 내 채용공고 확인(기업)
    List<JobPostingDTO> getJobPostingsByUserCode(String userCode);


//    // 현재 로그인한 회사 공고 개수
//    Long getJobPostingsByUserCodeCount(String userCode);

    default CompanyProfileDTO entityToDTO(CompanyProfile entity) {
        return CompanyProfileDTO.builder()
                .companyProfileCode(entity.getCompanyProfileCode())
                .companyDescription(entity.getCompanyDescription())
                .industry(entity.getIndustry())
                .websiteUrl(entity.getWebsiteUrl())
                .companyCode(entity.getCompanyCode())
                .companyType(entity.getCompanyType())
                .companyName(entity.getCompanyName())
                .ceoName(entity.getCeoName())
                .companyAddress(entity.getCompanyAddress())
                .userCode(entity.getUser().getUserCode())
                .uploadFileName(entity.getUploadFileName())
                .build();
    }

    default CompanyProfile dtoToEntity(CompanyProfileDTO dto, User user) {
        return CompanyProfile.builder()
                .companyProfileCode(dto.getCompanyProfileCode())
                .companyDescription(dto.getCompanyDescription())
                .industry(dto.getIndustry())
                .websiteUrl(dto.getWebsiteUrl())
                .companyCode(dto.getCompanyCode())
                .companyType(dto.getCompanyType())
                .companyName(dto.getCompanyName())
                .ceoName(dto.getCeoName())
                .companyAddress(dto.getCompanyAddress())
                .uploadFileName(dto.getUploadFileName())
                .user(user) // User 설정
                .build();
    }
}
