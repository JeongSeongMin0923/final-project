    package com.example.devjobs.resume.dto;

    import lombok.*;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public class LanguagesSkillsDTO {

        private String language;   // 언어
        private String level;      // 능력 수준(유창함, 비즈니스회화, 일상회화)

    }
