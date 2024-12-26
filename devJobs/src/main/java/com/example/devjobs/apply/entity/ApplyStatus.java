package com.example.devjobs.apply.entity;

public class ApplyStatus {

    public static final String APPLIED = "APPLIED";        // 지원 완료
    public static final String PASSED = "PASSED";          // 서류 통과
    public static final String INTERVIEW = "INTERVIEW";    // 면접
    public static final String ACCEPTED = "ACCEPTED";      // 최종 합격
    public static final String REJECTED = "REJECTED";      // 불합격

    private ApplyStatus() {
        // 객체 생성 방지
    }
}