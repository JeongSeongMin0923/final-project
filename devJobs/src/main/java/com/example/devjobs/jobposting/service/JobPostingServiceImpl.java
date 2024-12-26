package com.example.devjobs.jobposting.service;

import com.example.devjobs.companyprofile.dto.CompanyProfileDTO;
import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
import com.example.devjobs.companyprofile.service.CompanyProfileService;
import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.kakaomap.service.KakaoMapService;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.repository.UserRepository;
import com.example.devjobs.util.FileUtil;
import com.example.devjobs.util.S3FileUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobPostingServiceImpl implements JobPostingService {

    @Autowired
    JobPostingRepository repository;

    @Autowired
    UserRepository userRepository;

//    @Autowired
//    FileUtil fileUtil;

    @Autowired
    S3FileUtil fileUtil;

    @Autowired
    KakaoMapService kakaoMapService;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private CompanyProfileService profileService;

    // Skill 파싱
    public List<String> parseSkills(String skillString) {
        if (skillString == null || skillString.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(skillString.split(","))
                .map(String::trim) // 공백 제거
                .collect(Collectors.toList());
    }

    // 위도, 경도 파싱
    private Map<String, Object> parseCoordinates(String json) {
        ObjectMapper objectMapper = new ObjectMapper(); // Jackson ObjectMapper 사용
        Map<String, Object> result = new HashMap<>();
        try {
            JsonNode node = objectMapper.readTree(json);
            // JSON 응답에서 위도와 경도 값 추출
            result.put("latitude", node.get("documents").get(0).get("y").asDouble());
            result.put("longitude", node.get("documents").get(0).get("x").asDouble());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    // 공통 좌표 업데이트 메서드(지도 등록, 수정 시)
    private void updateCoordinates(JobPosting jobPosting) {
        if (jobPosting.getAddress() != null) {
            try {
                String coordinatesJson = kakaoMapService.getCoordinates(jobPosting.getAddress());
                System.out.println("Kakao API Response: " + coordinatesJson); // 응답 확인
                Map<String, Object> coordinates = parseCoordinates(coordinatesJson);
                jobPosting.setLatitude((Double) coordinates.get("latitude"));
                jobPosting.setLongitude((Double) coordinates.get("longitude"));
                System.out.println("Parsed Coordinates: " + coordinates); // 파싱된 결과 확인
            } catch (Exception e) {
                jobPosting.setLatitude(null);
                jobPosting.setLongitude(null);
                System.err.println("Failed to fetch coordinates: " + e.getMessage());
            }
        }
    }

    // KAKOMAP API용
    @Override
    public Optional<JobPosting> getbyId(Integer jobCode) {
        return repository.findById(jobCode);
    }

    // 전체 공고 카운트
    @Override
    public long countAllJobPostings() {
        return repository.countAllJobPostings();
    }

    // 진행중인 공고
    @Override
    public long countActiveJobPostings() {
        return repository.countActiveJobPostings();
    }

    @Override
    public int register(JobPostingDTO dto, MultipartFile uploadFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User user = userRepository.findByUserId(currentUserName);

        // JobPosting 엔티티 생성
        JobPosting jobPosting = dtoToEntity(dto);
        jobPosting.setUserCode(user); // 로그인한 사용자 설정

        // 주소 기반으로 좌표 설정
        updateCoordinates(jobPosting);

        // 파일 업로드 처리
        if (dto.getUploadFile() != null && !dto.getUploadFile().isEmpty()) {
            // S3 업로드
            String imgFileName = fileUtil.fileUpload(dto.getUploadFile());
            jobPosting.setImgFileName(imgFileName);
        }

        // 파일 업로드 처리
       if (uploadFile != null && !uploadFile.isEmpty()) {
            String imgPath = fileUtil.fileUpload(uploadFile); // S3 업로드 후 URL 반환
            System.out.println("S3 업로드 결과: " + imgPath);
            jobPosting.setImgPath(imgPath); // URL 저장
            jobPosting.setImgFileName(uploadFile.getOriginalFilename()); // 원본 파일 이름 저장
        }

        System.out.println("DB 저장 전 imgPath: " + jobPosting.getImgPath());
        System.out.println("DB 저장 전 imgFileName: " + jobPosting.getImgFileName());

        repository.save(jobPosting);
        return jobPosting.getJobCode();
    }




    @Override
    public List<JobPostingDTO> getList() {

        List<JobPosting> entityList = repository.findAll();
        List<JobPostingDTO> dtoList = entityList.stream()
                .map(entity -> {
                    JobPostingDTO dto = entityToDto(entity);

                    // 회사정보를 조회하여 리스트에 추가
                    CompanyProfileDTO profile = profileService.read(dto.getCompanyProfileCode());
                    dto.setProfile(profile);

                    return dto;
                })
                .collect(Collectors.toList());

        return dtoList;

    }
    @Override
    public JobPostingDTO read(Integer jobCode) {
        Optional<JobPosting> result = repository.findById(jobCode);
        if (result.isPresent()) {
            JobPosting jobPosting = result.get();
            return entityToDto(jobPosting);
        } else {
            return null;
        }
    }

    @Override
    public void modify(Integer jobCode, String title, String content, String recruitJob,
                       Integer recruitField, String salary, boolean postingStatus,
                       Integer workExperience, String tag, String jobCategory,
                       String skill, LocalDateTime postingDeadline, MultipartFile uploadFile, LocalDateTime lastUpdated, String address) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);
        if (loggedInUser == null) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        Optional<JobPosting> result = repository.findById(jobCode);

        if (result.isPresent()) {
            JobPosting entity = result.get();

            // 작성자 확인
            if (!entity.getUserCode().getUserCode().equals(loggedInUser.getUserCode())) {
                throw new SecurityException("작성자만 게시글을 수정할 수 있습니다.");
            }

            // 전달된 값만 업데이트
            if (title != null) entity.setTitle(title);
            if (content != null) entity.setContent(content);
            if (recruitJob != null) entity.setRecruitJob(recruitJob);
            if (recruitField != null) entity.setRecruitField(recruitField);
            if (salary != null) entity.setSalary(salary);
            entity.setPostingStatus(postingStatus);
            if (workExperience != null) entity.setWorkExperience(workExperience);
            if (tag != null) entity.setTag(tag);
            if (jobCategory != null) entity.setJobCategory(jobCategory);
            if (skill != null) {
                List<String> skillList = parseSkills(skill);
                entity.setSkill(String.join(",", skillList));
            }
            if (postingDeadline != null) entity.setPostingDeadline(postingDeadline);
            entity.setUpdateDate(lastUpdated);

            // 주소 변경 시 좌표 업데이트
            if (address != null && !address.equals(entity.getAddress())) {
                entity.setAddress(address);
                updateCoordinates(entity);
            }

            // 파일 업데이트
//            if (uploadFile != null && !uploadFile.isEmpty()) {
//                String fileName = fileUtil.fileUpload(uploadFile, "jobposting");
//                entity.setImgFileName(fileName);
//            }
            // 파일 업데이트
            if (uploadFile != null && !uploadFile.isEmpty()) {
                // S3에 업로드 및 URL 가져오기
                String fileName = fileUtil.fileUpload(uploadFile);

                entity.setImgPath(fileName); // URL 경로 저장
                entity.setImgFileName(uploadFile.getOriginalFilename()); // 원본파일 이름

            }

            repository.save(entity);
        } else {
            throw new IllegalArgumentException("해당 JobPosting 코드가 존재하지 않습니다.");
        }
    }

    @Override
    public void remove(Integer jobCode) {
        // 현재 로그인된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);
        if (loggedInUser == null) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        System.out.println("로그인한 유저의 ROLE: " + loggedInUser.getRole());

        // 삭제하려는 JobPosting 검색
        Optional<JobPosting> result = repository.findById(jobCode);

        if (result.isPresent()) {
            JobPosting entity = result.get();

            // 작성자와 로그인된 사용자 비교
            // ROLE이 ADMIN인 사람도 삭제할 수 있음
            if (!entity.getUserCode().getUserCode().equals(loggedInUser.getUserCode())
                    && !loggedInUser.getRole().equals("ROLE_ADMIN")) {
                throw new SecurityException("작성자만 게시글을 삭제할 수 있습니다.");
            }

            repository.deleteById(jobCode);
        } else {
            throw new IllegalArgumentException("해당 JobPosting 코드가 존재하지 않습니다.");
        }
    }

    @Override
    public List<String> getCompanyNamesFromJobPostings() {
        return jobPostingRepository.findCompanyNamesByJobPostings();
    }

    @Override
    public Integer getCompanyProfileCodeByJobCode(Integer jobCode) {
        // 1. JobPosting 조회
        JobPosting jobPosting = repository.findById(jobCode)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found for jobCode: " + jobCode));

        // 2. User 조회
        User user = userRepository.findByUserCode(jobPosting.getUserCode().getUserCode());
        if (user == null) {
            throw new IllegalArgumentException("User not found for userCode: " + jobPosting.getUserCode().getUserCode());
        }

        // 3. CompanyProfile 조회
        CompanyProfile companyProfile = user.getCompanyProfile();
        if (companyProfile == null) {
            throw new IllegalArgumentException("Company profile not found for userCode: " + user.getUserCode());
        }

        return companyProfile.getCompanyProfileCode();
    }


}



