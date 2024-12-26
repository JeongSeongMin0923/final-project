package com.example.devjobs.dummyuser.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DummyUserDTO {
    private String jobCategory; // 직무 카테고리
    private String skills; // 기술 목록
    private int workExperience; // 경력 (년수)
}