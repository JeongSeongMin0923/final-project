//package com.example.devjobs.service;
//
//import com.example.devjobs.resume.dto.CertificationsDTO;
//import com.example.devjobs.resume.dto.LanguagesSkillsDTO;
//import com.example.devjobs.resume.dto.ResumeDTO;
//import com.example.devjobs.resume.entity.Resume;
//import com.example.devjobs.resume.repository.ResumeRepository;
//import com.example.devjobs.resume.service.ResumeService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Random;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//public class ResumeServiceTest {
//
//    @Autowired
//    private ResumeService resumeService;
//
//    @Autowired
//    private ResumeRepository resumeRepository;
//
//    // 직무 카테고리 목록
//    private final String[] jobCategories = {
//            "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자",
//            "데이터 과학자", "게임 개발자", "모바일앱 개발자",
//            "데브옵스 엔지니어", "임베디드 엔지니어", "클라우드 엔지니어",
//            "시큐리티 엔지니어"
//    };
//
//    // 기술 스택 목록
//    private final String[] techSkills = {
//            "Java", "Spring", "SQL", "Python", "JavaScript", "React", "Node.js",
//            "AWS", "Docker", "Kubernetes", "TypeScript", "Go", "C++", "Ruby", "Scala"
//    };
//
//    @Test
//    void testGenerateRandomResumes() {
//        // 더미 데이터 30개 생성
//        Random random = new Random();
//        for (int i = 0; i < 30; i++) {
//            // 랜덤 직무 카테고리 선택
//            String jobCategory = jobCategories[random.nextInt(jobCategories.length)];
//
//            // 랜덤 기술 스택 선택 (3~5개)
//            int numSkills = 3 + random.nextInt(3);  // 3~5개 기술 스택을 랜덤으로 선택
//            StringBuilder skillsBuilder = new StringBuilder();
//            for (int j = 0; j < numSkills; j++) {
//                if (j > 0) {
//                    skillsBuilder.append(",");
//                }
//                skillsBuilder.append(techSkills[random.nextInt(techSkills.length)]);
//            }
//            String skills = skillsBuilder.toString();  // 기술 스택을 쉼표로 구분한 문자열로 만듦
//
//            // 랜덤 경력
//            String workExperience = (random.nextInt(10) + 1) + " years in Software Development"; // 1~10년
//
//            // 학력
//            String education = "Bachelor's Degree in Computer Science";
//
//            // 랜덤 자격증
//            List<CertificationsDTO> certifications = List.of(
//                    CertificationsDTO.builder().certificationName("AWS Certified").issueDate("2022-05").issuer("Amazon").build(),
//                    CertificationsDTO.builder().certificationName("Java SE 11").issueDate("2021-11").issuer("Oracle").build()
//            );
//
//            // 랜덤 언어 능력
//            List<LanguagesSkillsDTO> languageSkills = List.of(
//                    LanguagesSkillsDTO.builder().language("English").level("Advanced").build(),
//                    LanguagesSkillsDTO.builder().language("Korean").level("Intermediate").build()
//            );
//
//            // ResumeDTO 생성
//            ResumeDTO resumeDTO = ResumeDTO.builder()
//                    .workExperience(workExperience)
//                    .education(education)
//                    .certifications(certifications)
//                    .languageSkills(languageSkills)
//                    .skill(skills)
//                    .jobCategory(jobCategory)
//                    .uploadFileName("resume_" + i + ".pdf")
//                    .createdDate(LocalDateTime.now())
//                    .updatedDate(LocalDateTime.now())
//                    .build();
//
//            // Resume 등록
//            resumeService.register(resumeDTO, null);
//        }
//
//        // 등록된 30개의 Resume 확인
//        List<Resume> resumes = resumeRepository.findAll();
//        System.out.println("=== Resume 등록 및 조회 테스트 ===");
//        System.out.println("Total Resumes: " + resumes.size());
//
//        for (Resume resume : resumes) {
//            System.out.println("Resume Code: " + resume.getResumeCd());
//            System.out.println("Work Experience: " + resume.getWorkExperience());
//            System.out.println("Job Category: " + resume.getJobCategory());
//            System.out.println("Skills: " + resume.getSkill());
//        }
//
//        assertThat(resumes).hasSize(30); // 30개의 이력서가 등록되어야 함
//    }
//}