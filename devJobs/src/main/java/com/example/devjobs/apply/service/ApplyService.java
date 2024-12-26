package com.example.devjobs.apply.service;

import com.example.devjobs.apply.dto.ApplyDTO;
import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.user.entity.User;

import java.util.List;
import java.util.Map;

public interface ApplyService {

    int register(ApplyDTO dto);

    List<ApplyDTO> getList();

    List<ApplyDTO> getUserApplications(String userId);

    ApplyDTO read(int code);

    void modify(ApplyDTO dto);

    void remove(Integer code);

    void applyTo(Integer jobCode, String userCode, Integer resumeCode);

    List<Map<String, Object>> getMyApplyList(String userCode);
  
    boolean isDuplicateApplication(Integer jobCode, String userCode);

    // 회사 내 지원자관리
    List<Map<String, Object>> getApplicationsByJobPoster(String userCode);

    // 지원자 관리 내 상태 업데이트
    void updateApplyStatus(Integer applyCode, String newStatus);

    // 지원자 현황 카운트 (전체)
    Long getTotalApplications(String userCode);

    // 지원자 현황 카운트 (지원, 서류통과, 면접)
    Long getOngoingApplications(String userCode);

    Long getFinalApplications(String userCode);

    default ApplyDTO entityToDTO(Apply entity) {
        // ApplyDTO 객체 생성
        return ApplyDTO.builder()
                .applyCode(entity.getApplyCode()) // 지원코드
                .submissionDate(entity.getCreateDate()) // 등록일
                .updateDate(entity.getUpdateDate()) // 수정일
                .userCode(entity.getUserCode().getUserCode()) // 유저코드
                .jobCode(entity.getJobCode().getJobCode()) // JobPosting의 코드
                .resumeCode(entity.getResumeCode().getResumeCode()) // Resume의 코드
                .companyName(entity.getJobCode().getCompanyProfile().getCompanyName()) // 회사 이름 설정
                .applyStatus(entity.getApplyStatus()) // 지원 상태
                .build();
    }

    default Apply dtoToEntity(ApplyDTO dto) {
        // JobPosting 객체 가져오기
        JobPosting jobPosting = JobPosting.builder()
                .jobCode(dto.getJobCode())
                .build();

        // Resume 객체 가져오기
        Resume resume = Resume.builder()
                .resumeCode(dto.getResumeCode())
                .build();

        // User 객체 가져오기
        User user = User.builder()
                .userCode(dto.getUserCode())
                .build();

        // Apply 객체 생성
        Apply entity = Apply.builder()
                .applyCode(dto.getApplyCode()) // 지원코드
                .jobCode(jobPosting) // JobPosting 설정
                .resumeCode(resume) // Resume 설정
                .userCode(user) // User 설정
                .applyStatus(dto.getApplyStatus()) // 지원 상태 설정
                .build();

        return entity;
    }


}
