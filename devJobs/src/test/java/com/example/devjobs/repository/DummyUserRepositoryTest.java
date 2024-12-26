//package com.example.devjobs.repository;
//
//import com.example.devjobs.user.repository.UserRepository;
//import com.example.devjobs.userdummy.entity.User;
//import com.example.devjobs.userdummy.repository.UserRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//import java.util.Random;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//public class UserDummyRepositoryTest {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    public void testSaveAndFindUsers() {
//        // 1. 더미 데이터 생성
//        Random random = new Random();
//        List<String> jobCategories = List.of(
//                "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자",
//                "데이터 과학자", "게임 개발자", "모바일앱 개발자",
//                "데브옵스 엔지니어", "임베디드 엔지니어",
//                "클라우드 엔지니어", "시큐리티 엔지니어"
//        );
//        List<String> skillsList = List.of("Java", "Spring", "SQL", "JavaScript", "React", "Python", "Machine Learning", "Docker", "Kubernetes");
//
//        for (int i = 0; i < 30; i++) {
//            // 랜덤 직무, 스킬, 경력 생성
//            String jobCategory = jobCategories.get(random.nextInt(jobCategories.size())); // 직무 카테고리 무작위 선택
//            String skills = String.join(",", random.ints(0, skillsList.size())
//                    .distinct()
//                    .limit(3 + random.nextInt(3)) // 3~5개의 랜덤 스킬 선택
//                    .mapToObj(skillsList::get)
//                    .toList());
//            int experience = random.nextInt(6); // 0~5년 경력
//
//            // User 엔티티 생성
//            User user = User.builder()
//                    .jobCategory(jobCategory)
//                    .skills(skills)
//                    .workExperience(experience)
//                    .build();
//
//            // 저장
//            userRepository.save(user);
//        }
//
//        // 2. 저장된 사용자 조회
//        List<User> users = userRepository.findAll();
//
//        // 3. 검증
//        assertThat(users).hasSize(30); // 저장된 사용자 수
//        assertThat(users.get(0).getJobCategory()).isNotNull(); // 직무 카테고리 확인
//        assertThat(users.get(0).getSkills()).isNotNull(); // 스킬 확인
//        assertThat(users.get(0).getWorkExperience()).isBetween(0, 5); // 경력 확인
//    }
//}