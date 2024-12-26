package com.example.devjobs.jobposting.entity;

import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.common.BaseEntity;
import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "job_posting")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@AttributeOverride(name = "createDate", column = @Column(name = "posting_date"))  // BaseEntity의 createdDate를 posting_date로 덮어쓰기
public class JobPosting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_code", nullable = false)
    private Integer jobCode;  // 공고코드

    @Column(name = "title", nullable = false)
    private String title;  // 공고제목

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;  // 공고내용

    @Column(name = "recruit_job", nullable = false)
    private String recruitJob;  // 모집직무

    @Column(name = "recruit_field", nullable = false)
    private int recruitField;  // 모집인원

    @Column(name = "salary")
    private String salary;  // 급여

    @Column(name = "posting_deadline", nullable = false)
    private LocalDateTime postingDeadline;  // 공고마감일

    // 공고 상태 관련...
    @Column(name = "posting_status", nullable = false)
    private boolean postingStatus;  // 공고상태: true(모집중), false(마감)

    @Column(name = "work_experience", nullable = false)
    private Integer workExperience;  // 경력 (년 단위)

    @Column(name = "tag")
    private String tag;  // 태그

    @Column(name = "job_category", nullable = false)
    private String jobCategory;  // 직무 카테고리

    @Column(name = "img_file_name", length = 100)
    private String imgFileName; // 파일명

    @Column(name = "img_path")
    private String imgPath; // S3 URL을 저장할 필드

    // 추가된 skill 컬럼
    @Column(name = "skill", nullable = false, length = 255)
    private String skill; // 쉼표로 구분된 스킬 문자열 (예: "Java,Spring,SQL")

    // 기업프로필코드
    @ManyToOne
    @JoinColumn(name = "company_profile_code")
    CompanyProfile companyProfile;  // 기업프로필코드

    // 유저코드
    @ManyToOne
    @JoinColumn(name = "user_code")
    User userCode;

    @Transient // DB에 저장되지 않음(유사공고에 사용할 임시 데이터)
    private int matchScore; // 추천점수

    // 추가된 필드: 주소 및 좌표 정보
    @Column(name = "address", nullable = false)
    private String address;  // 근무지

    @Column(name = "latitude")
    private Double latitude;  // 근무지 위도

    @Column(name = "longitude")
    private Double longitude;  // 근무지 경도

    // JobPosting이 여러 Apply를 참조
    @OneToMany(mappedBy = "jobCode", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Apply> applies;

}
