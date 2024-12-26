package com.example.devjobs.companyprofile.entity;

import com.example.devjobs.common.BaseEntity;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.user.dto.request.auth.SignUpRequestDto;
import com.example.devjobs.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "company_profile")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class    CompanyProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer companyProfileCode;

    @OneToOne
    @JoinColumn(name = "user_code", nullable = false)
    private User user;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "industry")
    private String industry;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "company_code", unique = true)
    private String companyCode;

    @Column(name = "company_type", nullable = false)
    private String companyType;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "ceo_name", nullable = false)
    private String ceoName;

    @Column(name = "company_address", nullable = false)
    private String companyAddress;

    @Column(name = "logo_file_name", length = 255) // 로고 파일명 저장
    private String uploadFileName; // 저장된 로고 파일명

    // jobPosting이 companyProfile의 code를 참조하고 있기에 cascade로 jobposting의 게시글까지 삭제됨
    @OneToMany(mappedBy = "companyProfile", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<JobPosting> jobPostings;

    // 생성자
    public CompanyProfile(SignUpRequestDto dto, User user) {
        this.companyDescription = dto.getCompanyDescription();
        this.industry = dto.getIndustry();
        this.websiteUrl = dto.getWebsiteUrl();
        this.companyCode = dto.getCompanyCode();
        this.companyType = dto.getCompanyType();
        this.companyName = dto.getCompanyName();
        this.ceoName = dto.getCeoName();
        this.companyAddress = dto.getCompanyAddress();
        this.uploadFileName = dto.getUploadFileName();
        this.user = user;
    }
}
