package com.example.devjobs.companyprofile.service;

import com.example.devjobs.apply.dto.ApplyDTO;
import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.companyprofile.dto.CompanyProfileDTO;
import com.example.devjobs.companyprofile.dto.CompanyProfileUpdateDTO;
import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.repository.UserRepository;
import com.example.devjobs.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompanyProfileServiceImpl implements CompanyProfileService {

    @Autowired
    private CompanyProfileRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUtil fileUtil;

    @Transactional(readOnly = true)
    @Override
    public List<ApplyDTO> getApplicantsByCompanyProfile(Integer companyProfileCode){
            CompanyProfile companyProfile = repository.findById(companyProfileCode).orElseThrow(() -> new IllegalArgumentException("해당 회사 프로필을 찾을 수 없습니다."));

            List<JobPosting> jobPostings = companyProfile.getJobPostings();
            List<ApplyDTO> applicants = new ArrayList<>();

            for (JobPosting jobPosting : jobPostings) {
                List<Apply> applies = jobPosting.getApplies();
                applicants.addAll(applies.stream()
                        .map(this::entityToDTO)
                        .collect(Collectors.toList()));
            }

            return applicants;
    }



    private ApplyDTO entityToDTO(Apply entity) {
        return ApplyDTO.builder()
                .applyCode(entity.getApplyCode())
                .jobCode(entity.getJobCode().getJobCode())
                .resumeCode(entity.getResumeCode().getResumeCode())
                .applyStatus(entity.getApplyStatus())
                .submissionDate(entity.getCreateDate())
                .updateDate(entity.getUpdateDate())
                .userCode(entity.getUserCode().getUserCode())
                .build();
    }

    @Override
    public int getCurrentCompanyProfileCode() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("사용자가 인증되지 않았습니다.");
        }

        String currentUserName = authentication.getName();
        User user = userRepository.findByUserId(currentUserName);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        CompanyProfile companyProfile = repository.findByUser(user);
        if (companyProfile == null) {
            throw new IllegalArgumentException("사용자와 연결된 회사 프로필이 없습니다.");
        }

        return companyProfile.getCompanyProfileCode();
    }

    @Override
    public int register(CompanyProfileDTO dto, MultipartFile logoFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User user = userRepository.findByUserId(currentUserName);

        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        if ("company".equals(user.getType())) {
            CompanyProfile entity = dtoToEntity(dto, user);

            if (logoFile != null && !logoFile.isEmpty()) {
                validateFile(logoFile); // 파일 유효성 검사
                String uploadedFileName = fileUtil.fileUpload(logoFile, "companyLogo");
                entity.setUploadFileName(uploadedFileName);
            }

            repository.save(entity);
            return entity.getCompanyProfileCode();
        } else {
            throw new IllegalArgumentException("기업 회원만 프로필을 등록할 수 있습니다.");
        }
    }

    @Override
    public List<CompanyProfileDTO> getList() {
        return repository.findAll().stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyProfileDTO read(int code) {
        return repository.findById(code)
                .map(this::entityToDTO)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필 코드가 존재하지 않습니다."));
    }

    @Override
    public void modify(CompanyProfileUpdateDTO updateDTO) {
        // 1. 기존 데이터 조회
        CompanyProfile entity = repository.findById(updateDTO.getCompanyProfileCode())
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필 코드가 존재하지 않습니다."));

        // 2. 인증된 사용자 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);

        if (!entity.getUser().getUserCode().equals(loggedInUser.getUserCode())) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        // 3. 수정 데이터 반영
        if (updateDTO.getCompanyName() != null) {
            entity.setCompanyName(updateDTO.getCompanyName());
        }
        if (updateDTO.getCompanyType() != null) {
            entity.setCompanyType(updateDTO.getCompanyType());
        }
        if (updateDTO.getCeoName() != null) {
            entity.setCeoName(updateDTO.getCeoName());
        }
        if (updateDTO.getCompanyAddress() != null) {
            entity.setCompanyAddress(updateDTO.getCompanyAddress());
        }
        if (updateDTO.getCompanyDescription() != null) {
            entity.setCompanyDescription(updateDTO.getCompanyDescription());
        }
        if (updateDTO.getIndustry() != null) {
            entity.setIndustry(updateDTO.getIndustry());
        }
        if (updateDTO.getWebsiteUrl() != null) {
            entity.setWebsiteUrl(updateDTO.getWebsiteUrl());
        }

        // 4. 저장
        repository.save(entity);
    }


    @Override
    public void remove(int code) {
        CompanyProfile entity = repository.findById(code)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필 코드가 존재하지 않습니다."));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);

        if (!entity.getUser().getUserCode().equals(loggedInUser.getUserCode())) {
            throw new SecurityException("작성자만 삭제할 수 있습니다.");
        }

        if (entity.getUploadFileName() != null) {
            fileUtil.deleteFile(entity.getUploadFileName());
        }

        repository.deleteById(code);
    }

    private void validateFile(MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
            }
            if (file.getSize() > 5 * 1024 * 1024) { // 5MB 제한
                throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없습니다.");
            }
        }
    }

    // 회사 정보 내 채용공고 확인(유저)
    @Override
    public List<JobPostingDTO> getJobPostingsByCompanyProfileCode(Integer companyProfileCode) {
        List<JobPosting> jobPostings = repository.findJobPostingsByCompanyProfileCode(companyProfileCode);

        // 엔티티를 DTO로 변환
        return jobPostings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobPostingDTO> getJobPostingsByUserCode(String userCode) {
        List<JobPosting> jobPostings = repository.findJobPostingsByUserCode(userCode);

        // 엔티티를 DTO로 변환
        return jobPostings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


//    @Override
//    public Long getJobPostingsByUserCodeCount(String userCode) {
//        return repository.countJobPostingsByUserCode(userCode);
//    }

    private JobPostingDTO mapToDTO(JobPosting jobPosting) {
        return JobPostingDTO.builder()
                .jobCode(jobPosting.getJobCode())
                .title(jobPosting.getTitle())
                .content(jobPosting.getContent())
                .recruitJob(jobPosting.getRecruitJob())
                .recruitField(jobPosting.getRecruitField())
                .salary(jobPosting.getSalary())
                .postingDate(jobPosting.getCreateDate())
                .postingDeadline(jobPosting.getPostingDeadline())
                .postingStatus(jobPosting.isPostingStatus())
                .skill(jobPosting.getSkill())
                .address(jobPosting.getAddress())
                .latitude(jobPosting.getLatitude())
                .longitude(jobPosting.getLongitude())
                .workExperience(jobPosting.getWorkExperience())
                .build();
    }

}
