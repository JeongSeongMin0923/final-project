package com.example.devjobs.resume.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {

    private Integer resumeCode;              // 이력서 코드

    private String introduce; // 소개글

    private String work; // 담당업무

    private String link; // 링크 (ex. 깃허브..)

    private Integer workExperience; // 경력(년차)

    private List<ExperienceDetailDTO> experienceDetail;    // 세부경력

    private List<EducationDTO> education;         // 학력

    private List<CertificationsDTO> certifications;    // 자격증

    private List<LanguagesSkillsDTO> languageSkills;   // 언어 능력

    private String skill;             // 스킬

    private String jobCategory; //직무

    private LocalDateTime createDate; // 생성일

    private LocalDateTime updateDate; // 수정일

    private String userCode; // 유저 코드

    // 파일 첨부 관련..
    private MultipartFile uploadFile;   // 이력서 파일 (파일명 또는 경로)

    private String uploadFileName;

}
