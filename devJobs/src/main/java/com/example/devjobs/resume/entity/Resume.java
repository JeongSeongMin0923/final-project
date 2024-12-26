package com.example.devjobs.resume.entity;

import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.common.BaseEntity;
import com.example.devjobs.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resume")
public class Resume extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_code")
    private Integer resumeCode; // 이력서 코드

    @Column(columnDefinition = "TEXT")
    private String introduce;  // 소개글

    @Column(columnDefinition = "TEXT")
    private String work;  // 담당업무

    @Column
    private String link;  // 링크 (ex. 깃허브 등)

    @Column
    private Integer workExperience;  // 경력 (년차, JSON)

    @Column(columnDefinition = "json")
    private String experienceDetail;  // 세부경력 (JSON)

    @Column(columnDefinition = "json")
    private String education;  // 학력 (JSON)

    // columnDefinition은 해당 컬럼을 JSON 형태로 저장하겠다고 명시하는 것
    @Column(columnDefinition = "json")
    private String certifications; // 자격증 (JSON 형태로 저장)

    @Column(name = "language_skills", columnDefinition = "json")
    private String languageSkills; // 언어 능력 (JSON 형태로 저장)

    @Column(length = 255)
    private String skill; // 스킬

    @Column
    private String jobCategory; // 직무 카테고리

    @Column(name = "upload_file_name", length = 255)
    private String uploadFileName; // 이력서 파일 (파일명 또는 경로)

    @ManyToOne
    @JoinColumn(name = "user_code", nullable = false)
    private User userCode; // 유저 코드

    @OneToMany(mappedBy = "resumeCode", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Apply> applies;

}
