package com.example.devjobs.jobposting.service;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface JobPostingService {

    int register(JobPostingDTO dto, MultipartFile jobPostingFolder);

    List<JobPostingDTO> getList();

    JobPostingDTO read(Integer jobCode);

    void remove(Integer jobCode);

    List<String> getCompanyNamesFromJobPostings();

    // KAKOMAP API용
    Optional<JobPosting> getbyId(Integer jobCode);

    // 전체 공고 조회
    long countAllJobPostings();

    // 진행중인 공고 조회
    long countActiveJobPostings();

    Integer getCompanyProfileCodeByJobCode(Integer jobCode);

    void modify(Integer jobCode, String title, String content, String recruitJob,
                Integer recruitField, String salary, boolean postingStatus,
                Integer workExperience, String tag, String jobCategory,
                String skill, LocalDateTime postingDeadline, MultipartFile uploadFile, LocalDateTime lastUpdated, String address);

    default JobPosting dtoToEntity(JobPostingDTO dto) {

        // CompanyProfile 가져오기(기업프로필)
        CompanyProfile companyProfile = new CompanyProfile();
        companyProfile.setCompanyProfileCode(dto.getCompanyProfileCode());

        // UserCode 가져오기
        User user = new User();
        user.setUserCode(dto.getUserCode());

        // JobPosting 객체를 생성
        JobPosting jobPosting = JobPosting.builder()
                .jobCode(dto.getJobCode())
                .title(dto.getTitle())
                .content(dto.getContent())
                .recruitJob(dto.getRecruitJob())
                .recruitField(dto.getRecruitField())
                .salary(dto.getSalary())
                .postingDeadline(dto.getPostingDeadline())
                .postingStatus(dto.isPostingStatus())
                .workExperience(dto.getWorkExperience())
                .tag(dto.getTag())
                .jobCategory(dto.getJobCategory())
                .imgFileName(dto.getImgFileName())
                .skill(dto.getSkill())
                .address(dto.getAddress()) // 주소만 매핑
                .companyProfile(companyProfile)
                .userCode(user)
                .build();

        return jobPosting;
    }

    default JobPostingDTO entityToDto(JobPosting entity) {
        JobPostingDTO dto = JobPostingDTO.builder()
                .jobCode(entity.getJobCode())
                .title(entity.getTitle())
                .content(entity.getContent())
                .recruitJob(entity.getRecruitJob())
                .recruitField(entity.getRecruitField())
                .salary(entity.getSalary())
                .postingDate(entity.getCreateDate())
                .postingDeadline(entity.getPostingDeadline())
                .postingStatus(entity.isPostingStatus())
                .workExperience(entity.getWorkExperience())
                .tag(entity.getTag())
                .jobCategory(entity.getJobCategory())
                .imgFileName(entity.getImgFileName()) // 원본 파일 이름
                .imgPath(entity.getImgPath()) // S3 URL 경로
                .skill(entity.getSkill()) // 추가된 skill 필드
                .address(entity.getAddress()) // 주소 매핑
                .latitude(entity.getLatitude()) // 위도 매핑
                .longitude(entity.getLongitude()) // 경도 매핑
                .companyProfileCode(entity.getCompanyProfile().getCompanyProfileCode())
                .userCode(entity.getUserCode().getUserCode())
                // imgPath 필드는 @Transient로 설정되어 데이터베이스에 저장되지 않으며,
                // getImgPath() 메서드를 통해 imgDirectory와 imgFileName을 결합한 경로를 반환
                .build();
        return dto;
    }
}