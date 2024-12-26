package com.example.devjobs.resume.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDTO {

    private String date;   // 날짜(1900.11.11 ~ 으로 직접 입력)
    private String school; // 학교
    private String major; // 전공

}

