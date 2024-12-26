package com.example.devjobs.resume.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceDetailDTO {

    private String company;        //    회사명
    private String department;     //    부서명
    private String startDate;      //    입사년월
    private String endDate;        //    퇴사년월
    private String position;       //    직급
    private String responsibility; //    담당직무
    private String salary;        //    연봉

}
