package com.example.devjobs.resume.dto;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationsDTO {

    private String certificationName;  // 자격증 이름
    private String issueDate;       // 발급일
    private String issuer;          // 발급기관

}