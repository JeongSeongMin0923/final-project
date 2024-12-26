package com.example.devjobs.apply.service;

import com.example.devjobs.apply.dto.ApplyDTO;
import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.apply.entity.ApplyStatus;
import com.example.devjobs.apply.entity.ApplyStatusValidator;
import com.example.devjobs.apply.repository.ApplyRepository;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.resume.repository.ResumeRepository;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplyServiceImpl implements ApplyService {

    @Autowired
    private ApplyRepository applyRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    // 지원서 등록
    @Override
    public int register(ApplyDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);
        if (loggedInUser == null) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        Apply entity = dtoToEntity(dto);
        entity.setUserCode(loggedInUser);

        applyRepository.save(entity);

        return entity.getApplyCode();
    }

    // 지원서 목록 조회
    @Override
    public List<ApplyDTO> getList() {
        List<Apply> entityList = applyRepository.findAll();

        List<ApplyDTO> dtoList = entityList.stream()
                .map(entity -> entityToDTO(entity))
                .collect(Collectors.toList());

        return dtoList;
    }

    // 사용자 지원 정보 조회
    @Override
    public List<ApplyDTO> getUserApplications(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");
        }

        List<Apply> applications = applyRepository.findByUserCode(user);
        return applications.stream()
                .map(this::entityToDTO) //회사 이름이 포함된 DTO로 변환
                .collect(Collectors.toList());
    }


    // 지원서 단일 조회
    @Override
    public ApplyDTO read(int code) {
        Optional<Apply> result = applyRepository.findById(code);
        return result.map(entity -> entityToDTO(entity)).orElse(null);
    }

    // 지원서 수정
    @Override
    public void modify(ApplyDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);
        if (loggedInUser == null) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        Optional<Apply> result = applyRepository.findById(dto.getApplyCode());
        if (result.isPresent()) {
            Apply entity = result.get();

            if (!entity.getUserCode().getUserCode().equals(loggedInUser.getUserCode())) {
                throw new SecurityException("작성자만 지원서를 수정할 수 있습니다.");
            }

            // jobCode 업데이트
            if (dto.getJobCode() != null) {
                Optional<JobPosting> jobPosting = jobPostingRepository.findById(dto.getJobCode());
                if (jobPosting.isPresent()) {
                    entity.setJobCode(jobPosting.get());
                }
            }

            // resumeCode 업데이트
            if (dto.getResumeCode() != null) {
                Optional<Resume> resume = resumeRepository.findById(dto.getResumeCode());
                if (resume.isPresent()) {
                    entity.setResumeCode(resume.get());
                }
            }

            // applyStatus 업데이트
            if (dto.getApplyStatus() != null) {
                if (!ApplyStatusValidator.isValid(dto.getApplyStatus())) {
                    throw new IllegalArgumentException("Invalid apply status: " + dto.getApplyStatus());
                }
                entity.setApplyStatus(dto.getApplyStatus());
            }

            applyRepository.save(entity);
        } else {
            throw new IllegalArgumentException("해당 지원서 코드가 존재하지 않습니다.");
        }
    }

    // 지원서 삭제
    @Override
    public void remove(Integer applyCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        String currentUserName = authentication.getName();
        User loggedInUser = userRepository.findByUserId(currentUserName);
        if (loggedInUser == null) {
            throw new IllegalArgumentException("로그인된 사용자 정보를 찾을 수 없습니다.");
        }

        Optional<Apply> result = applyRepository.findById(applyCode);

        if (result.isPresent()) {
            Apply entity = result.get();

            if (!entity.getUserCode().getUserCode().equals(loggedInUser.getUserCode())) {
                throw new SecurityException("작성자만 지원서를 삭제할 수 있습니다.");
            }

            applyRepository.delete(entity);
        } else {
            throw new IllegalArgumentException("해당 지원서 코드가 존재하지 않습니다.");
        }
    }

    // 지원하기
    @Transactional
    @Override
    public void applyTo(Integer jobCode, String userCode, Integer resumeCode) {

        if (jobCode == null) {
            throw new IllegalArgumentException("공고 코드가 null입니다.");
        }

        // 공고 확인
        Optional<JobPosting> optionalJobPosting = jobPostingRepository.findById(jobCode);
        if (!optionalJobPosting.isPresent()) {
            throw new IllegalArgumentException("해당 공고가 존재하지 않습니다.");
        }

        JobPosting jobPosting = optionalJobPosting.get();

        // 사용자 확인
        Optional<User> optionalUser = userRepository.findById(userCode);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("해당 사용자가 존재하지 않습니다.");
        }
        User user = optionalUser.get();

        // 이력서 확인
        Optional<Resume> optionalResume = resumeRepository.findById(resumeCode);
        if (!optionalResume.isPresent()) {
            throw new IllegalArgumentException("해당 이력서가 존재하지 않습니다.");
        }
        Resume resume = optionalResume.get();

        // Apply 엔티티 생성
        Apply apply = Apply.builder()
                .jobCode(jobPosting)     // 연관된 공고
                .userCode(user)          // 연관된 사용자
                .resumeCode(resume)      // 연관된 이력서
                .applyStatus(ApplyStatus.APPLIED) // 지원 상태
                .build();

        // Apply 엔티티 저장
        applyRepository.save(apply);
    }

    @Transactional
    public List<Map<String, Object>> getMyApplyList(String userCode) {

        User user = new User();

        String prefixedUserCode;

        if ("kakao".equals(user.getType())) {
            prefixedUserCode = "kakao_" + userCode;
        } else if ("naver".equals(user.getType())) {
            prefixedUserCode = "naver_" + userCode;
        } else {
            prefixedUserCode = "dev_" + userCode;
        }

        // 유저 확인
        user = userRepository.findById(prefixedUserCode)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        System.out.println(userCode);

        // 유저의 지원 내역 조회 후 필요한 데이터만 반환
        return applyRepository.findByUserCode(user).stream()
                .map(apply -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("applyCode", apply.getApplyCode());          // 지원 코드
                    map.put("companyName", apply.getJobCode().getCompanyProfile().getCompanyName()); // 회사 이름
                    map.put("companyLogo", apply.getJobCode().getCompanyProfile().getUploadFileName()); // 회사 로고
                    map.put("jobTitle", apply.getJobCode().getTitle());  // 공고 제목
                    map.put("applyStatus", apply.getApplyStatus());      // 지원 상태
                    map.put("submissionDate", apply.getCreateDate());    // 지원 날짜
                    return map;
                })
                .collect(Collectors.toList());
    }

  @Override
    public boolean isDuplicateApplication(Integer jobCode, String userCode) {
        JobPosting jobPosting = JobPosting.builder()
                .jobCode(jobCode) //PK
                .build();
        User user = User.builder()
                .userCode(userCode) //PK
                .build();
//        Optional<Apply> result = applyRepository.findByJobCodeAndUserCode(jobPosting, user);
//        return result.isPresent();

        List<Apply> result = applyRepository.findByJobCodeAndUserCode(jobPosting, user);

        if(result.size() > 0) {
            return true;
        }
        return false;
    }

    // 지원자 관리 가져오는 메소드
    @Override
    public List<Map<String, Object>> getApplicationsByJobPoster(String userCode) {
        return applyRepository.findApplicationsByJobPoster(userCode);
    }


    @Override
    @Transactional
    public void updateApplyStatus(Integer applyCode, String newStatus) {
        Apply apply = applyRepository.findById(applyCode)
                .orElseThrow(() -> new IllegalArgumentException("지원서가 존재하지 않습니다."));

        System.out.println(applyCode);

        apply.setApplyStatus(newStatus);
        applyRepository.save(apply);
    }

    @Override
    public Long getTotalApplications(String userCode) {
        return applyRepository.countTotalApplicationsByUserCode(userCode);
    }

    @Override
    public Long getOngoingApplications(String userCode) {
        return applyRepository.countOngoingApplicationsByUserCode(userCode);
    }

    @Override
    public Long getFinalApplications(String userCode) {
        return applyRepository.countFinalApplicationsByUserCode(userCode);
    }
}