//package com.example.devjobs.service;
//
//import com.example.devjobs.apply.dto.ApplyDTO;
//import com.example.devjobs.apply.entity.Apply;
//import com.example.devjobs.apply.entity.ApplyStatus;
//import com.example.devjobs.apply.repository.ApplyRepository;
//import com.example.devjobs.apply.service.ApplyService;
//import com.example.devjobs.jobposting.entity.JobPosting;
//import com.example.devjobs.jobposting.repository.JobPostingRepository;
//import com.example.devjobs.resume.entity.Resume;
//import com.example.devjobs.resume.repository.ResumeRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//class ApplyServiceTest {
//
//    @Autowired
//    private ApplyService applyService;
//
//    @Autowired
//    private ApplyRepository applyRepository;
//
//    @Autowired
//    private JobPostingRepository jobPostingRepository;
//
//    @Autowired
//    private ResumeRepository resumeRepository;
//
//    // REGISTER 메서드: 테스트 데이터 생성
//    private Apply createSampleApply() {
//        // 외래키 JobPosting 생성
//        JobPosting jobPosting = jobPostingRepository.save(
//                JobPosting.builder()
//                        .title("Software Engineer")
//                        .content("Develop software solutions.")
//                        .recruitJob("Backend Developer")
//                        .recruitField(3)
//                        .postingDeadline(LocalDateTime.now().plusDays(30))
//                        .postingStatus("모집중")
//                        .jobCategory("IT")
//                        .skill("Java, Spring, SQL")
//                        .workExperience("3 years in Software Development")
//                        .build()
//        );
//
//        // 외래키 Resume 생성
//        Resume resume = resumeRepository.save(
//                Resume.builder()
//                        .workExperience("3 years in Software Development")
//                        .education("Bachelor's Degree in Computer Science")
//                        .skill("Java, Spring, SQL")
//                        .build()
//        );
//
//        // Apply 생성 및 저장
//        Apply apply = Apply.builder()
//                .jobCode(jobPosting)
//                .resumeCd(resume)
//                .applyStatus(ApplyStatus.APPLIED)
//                .build();
//
//        return applyRepository.save(apply);
//    }
//
//    @Test
//    void testRegisterApply() {
//        Apply apply = createSampleApply();
//
//        System.out.println("=== Apply 등록 테스트 ===");
//        System.out.println("Apply Code: " + apply.getApplyCode());
//        System.out.println("Job Code: " + apply.getJobCode().getJobCode());
//        System.out.println("Resume Code: " + apply.getResumeCd().getResumeCd());
//        System.out.println("Status: " + apply.getApplyStatus());
//
//        assertThat(apply).isNotNull();
//    }
//
//    @Test
//    void testReadApply() {
//        // 테스트 데이터 준비
//        Apply apply = createSampleApply();
//
//        // Apply 데이터 조회
//        ApplyDTO applyDTO = applyService.read(apply.getApplyCode());
//
//        System.out.println("=== Apply 조회 테스트 ===");
//        System.out.println("Apply Code: " + applyDTO.getApplyCode());
//        System.out.println("Job Code: " + applyDTO.getJobCode());
//        System.out.println("Resume Code: " + applyDTO.getResumeCd());
//        System.out.println("Status: " + applyDTO.getApplyStatus());
//    }
//
//    @Test
//    void testUpdateApply() {
//        // 테스트 데이터 준비
//        Apply apply = createSampleApply();
//
//        // Apply 수정
//        ApplyDTO modifyDTO = ApplyDTO.builder()
//                .applyCode(apply.getApplyCode())
//                .applyStatus(ApplyStatus.PASSED) // 상태를 "PASSED"로 변경
//                .build();
//
//        applyService.modify(modifyDTO);
//
//        ApplyDTO updatedApply = applyService.read(apply.getApplyCode());
//
//        System.out.println("=== Apply 수정 테스트 ===");
//        System.out.println("Updated Apply Code: " + updatedApply.getApplyCode());
//        System.out.println("Updated Status: " + updatedApply.getApplyStatus());
//
//        assertThat(updatedApply.getApplyStatus()).isEqualTo(ApplyStatus.PASSED);
//    }
//
//    @Test
//    void testDeleteApply() {
//        // 테스트 데이터 준비
//        Apply apply = createSampleApply();
//
//        // Apply 삭제
//        applyService.remove(apply.getApplyCode());
//
//        Optional<Apply> deletedApply = applyRepository.findById(apply.getApplyCode());
//
//        System.out.println("=== Apply 삭제 테스트 ===");
//        System.out.println("Deleted Apply Exists: " + deletedApply.isPresent());
//
//        assertThat(deletedApply).isEmpty();
//    }
//
//    @Test
//    void testListApply() {
//        // 테스트 데이터 준비
//        createSampleApply();
//        createSampleApply();
//
//        // Apply 리스트 조회
//        List<ApplyDTO> applies = applyService.getList();
//
//        System.out.println("=== Apply 리스트 조회 테스트 ===");
//        System.out.println("Total Applies: " + applies.size());
//
//        for (ApplyDTO apply : applies) {
//            System.out.println("Apply Code: " + apply.getApplyCode());
//            System.out.println("Job Code: " + apply.getJobCode());
//            System.out.println("Resume Code: " + apply.getResumeCd());
//        }
//
//        assertThat(applies).isNotEmpty();
//    }
//}