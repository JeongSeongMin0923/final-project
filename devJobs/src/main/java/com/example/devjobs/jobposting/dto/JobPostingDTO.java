package com.example.devjobs.jobposting.dto;

import com.example.devjobs.companyprofile.dto.CompanyProfileDTO;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingDTO {

    private Integer jobCode; // 공고번호

    private String title;  // 공고제목

    private String content;  // 공고내용

    private String recruitJob;  // 모집직무

    private int recruitField;  // 모집인원

    private String salary;  // 급여

    private LocalDateTime postingDate;  // 공고시작일

    private LocalDateTime postingDeadline;  // 공고마감일

    private boolean postingStatus;  // 공고상태

    private Integer workExperience;  // 경력

    private String tag;  // 태그

    private String jobCategory;  // 직무 카테고리

    // imgFile 관련 ...
    private MultipartFile uploadFile;  // 파일 스트림

    private String imgFileName;  // 업로드된 파일명

    private String imgPath; // s3 저장 (URL)

    private CompanyProfileDTO profile;  // 회사정보 추가!

    private Integer companyProfileCode; // 기업프로필코드

    private String skill; // 쉼표로 구분된 스킬 문자열 (예: "Java,Spring,SQL")

    private String userCode; // 유저 코드

    private String address;  // 공고 주소

    private Double latitude;  // 위도

    private Double longitude;  // 경도

}
