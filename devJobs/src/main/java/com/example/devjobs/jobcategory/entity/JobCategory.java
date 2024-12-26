package com.example.devjobs.jobcategory.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "job_category")
public class JobCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_code")
    private Integer categoryCode; // 직무 카테고리 코드

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName; // 직무 카테고리 이름

}
