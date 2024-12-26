package com.example.devjobs.jobcategory.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCategoryDTO {

    private Integer categoryCode;

    private String categoryName;

}
