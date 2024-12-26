//package com.example.devjobs.service;
//
//import com.example.devjobs.companyprofile.entity.CompanyProfile;
//import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
//import com.example.devjobs.jobposting.dto.JobPostingDTO;
//import com.example.devjobs.jobposting.entity.JobPosting;
//import com.example.devjobs.jobposting.repository.JobPostingRepository;
//import com.example.devjobs.jobposting.service.JobPostingService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.test.annotation.Rollback;
//
//import java.time.LocalDateTime;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Optional;
//import java.util.Random;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//public class JobPostingServiceTest {
//
//    @Autowired
//    private JobPostingService jobPostingService;
//
//    @Autowired
//    private JobPostingRepository jobPostingRepository;
//
//    @Autowired
//    private CompanyProfileRepository companyProfileRepository;
//
//    private final Random random = new Random();
//
//    private final List<String> jobCategories = Arrays.asList(
//            "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자",
//            "데이터 과학자", "게임 개발자", "모바일앱 개발자",
//            "데브옵스 엔지니어", "임베디드 엔지니어", "클라우드 엔지니어",
//            "시큐리티 엔지니어"
//    );
//
//    private final List<String> skills = Arrays.asList(
//            "Java", "Spring", "SQL", "JavaScript", "React",
//            "Python", "Machine Learning", "Docker", "Kubernetes",
//            "AWS", "Node.js", "MySQL", "MongoDB", "Git"
//    );
//
//    private final List<String> workExperiences = Arrays.asList("신입", "2년", "3년", "경력");
//
//    @Test
//    @Transactional
//    @Rollback(false) // 롤백을 방지하여 데이터를 DB에 그대로 저장
//    void testCreateJobPosting() {
//        // CompanyProfile 생성
//        CompanyProfile companyProfile = companyProfileRepository.save(
//                CompanyProfile.builder()
//                        .companyName("Example Company")
//                        .industry("IT")
//                        .build()
//        );
//
//        // 10개의 더미 JobPosting 생성
//        for (int i = 0; i < 10; i++) {
//            JobPostingDTO jobPostingDTO = JobPostingDTO.builder()
//                    .title("Software Engineer " + i)
//                    .content("Develop and maintain software systems.")
//                    .recruitJob("Backend Developer")
//                    .recruitField(3)
//                    .salary("5000-7000 USD")
//                    .postingDate(LocalDateTime.now())
//                    .postingDeadline(LocalDateTime.now().plusDays(30))
//                    .postingStatus("모집중")
//                    .workExperience(randomFromList(workExperiences))
//                    .tag("Java,Spring,SQL")
//                    .jobCategory(randomFromList(jobCategories))
//                    .skill(randomFromList(skills))
//                    .companyProfileCd(companyProfile.getCompanyProfileCd())
//                    .build();
//
//            // 등록
//            jobPostingService.register(jobPostingDTO, null);
//        }
//
//        // 조회 후 검증
//        List<JobPosting> jobPostings = jobPostingRepository.findAll();
//        assertThat(jobPostings).isNotEmpty();
//        assertThat(jobPostings.size()).isEqualTo(10); // 10개의 JobPosting이 생성되어야 함
//    }
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    void testUpdateJobPosting() {
//        // 수정할 JobPosting 찾기
//        Optional<JobPosting> existingJobPosting = jobPostingRepository.findById(1);
//        assertThat(existingJobPosting).isPresent();
//
//        JobPostingDTO jobPostingDTO = JobPostingDTO.builder()
//                .title("Senior Software Engineer")
//                .content("Lead the software development team.")
//                .recruitJob("Backend Developer")
//                .recruitField(3)
//                .salary("7000-10000 USD")
//                .postingDate(LocalDateTime.now())
//                .postingDeadline(LocalDateTime.now().plusDays(30))
//                .postingStatus("모집중")
//                .workExperience("경력")
//                .tag("Java,Spring,SQL")
//                .jobCategory(randomFromList(jobCategories))
//                .skill(randomFromList(skills))
//                .companyProfileCd(1)  // 예시로 companyProfileCd를 1로 설정
//                .build();
//
//        // 수정
//        jobPostingService.modify(
//                1, // 기존 jobCode
//                jobPostingDTO.getTitle(),
//                jobPostingDTO.getContent(),
//                jobPostingDTO.getRecruitJob(),
//                jobPostingDTO.getRecruitField(),
//                jobPostingDTO.getSalary(),
//                jobPostingDTO.getPostingStatus(),
//                jobPostingDTO.getWorkExperience(),
//                jobPostingDTO.getTag(),
//                jobPostingDTO.getJobCategory(),
//                jobPostingDTO.getSkill(),
//                jobPostingDTO.getPostingDeadline(),
//                null,
//                LocalDateTime.now()
//        );
//
//        JobPostingDTO updatedJobPosting = jobPostingService.read(1);
//        assertThat(updatedJobPosting.getTitle()).isEqualTo("Senior Software Engineer");
//    }
//
//    @Test
//    @Transactional
//    @Rollback(false)
//    void testDeleteJobPosting() {
//        // 삭제할 JobPosting 찾기
//        Optional<JobPosting> existingJobPosting = jobPostingRepository.findById(1);
//        assertThat(existingJobPosting).isPresent();
//
//        // 삭제
//        jobPostingService.remove(1);
//
//        Optional<JobPosting> deletedJobPosting = jobPostingRepository.findById(1);
//        assertThat(deletedJobPosting).isEmpty(); // 삭제 후 찾을 수 없어야 함
//    }
//
//    @Test
//    void testReadJobPosting() {
//        // 조회할 공고가 있는지 확인
//        List<JobPosting> jobPostings = jobPostingRepository.findAll();
//        assertThat(jobPostings).isNotEmpty();
//        System.out.println("Total Job Postings: " + jobPostings.size());
//
//        for (JobPosting jobPosting : jobPostings) {
//            System.out.println("Job Title: " + jobPosting.getTitle());
//        }
//    }
//
//    private String randomFromList(List<String> list) {
//        return list.get(random.nextInt(list.size()));
//    }
//}