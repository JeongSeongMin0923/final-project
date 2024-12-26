package com.example.devjobs.dummyuser.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "dummy_user")
public class DummyUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 고유 ID

    @Column(nullable = false)
    private String jobCategory; // 직무 카테고리

    @Column(nullable = false)
    private String skills; // 기술 목록 (쉼표로 구분된 문자열)

    @Column(nullable = false)
    private int workExperience; // 경력 (년수)
}
