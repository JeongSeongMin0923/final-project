package com.example.devjobs.apply.entity;

import com.example.devjobs.common.BaseEntity;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "apply")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(name = "createDate", column = @Column(name = "submission_date"))  // BaseEntity의 createdDate를 submission_date로 덮어쓰기
public class Apply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apply_code")
    private Integer applyCode;

    @ManyToOne
    @JoinColumn(name = "job_code", referencedColumnName = "job_code")
    private JobPosting jobCode;  // 공고 코드

    @Column(name = "apply_status", nullable = false, length = 20) // 상태를 문자열로 저장
    private String applyStatus;  // 지원 상태

    @ManyToOne
    @JoinColumn(name = "resume_code", referencedColumnName = "resume_code")
    private Resume resumeCode;  // 이력서 코드

    @ManyToOne
    @JoinColumn(name = "user_code")
    private User userCode;



}