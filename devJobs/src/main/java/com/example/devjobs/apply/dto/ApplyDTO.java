package com.example.devjobs.apply.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyDTO {

    private Integer applyCode; // 지원 코드

    private Integer jobCode; // 구인공고 코드(jobposting PK)

    private String applyStatus; // 지원 상태

    private Integer resumeCode; // 이력서 코드(resume PK)

    private LocalDateTime submissionDate; // 작성일

    private LocalDateTime updateDate; // 수정일

    private String userCode; // 유저 코드
    
    private String companyName; // 회사이름

}
