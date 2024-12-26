package com.example.devjobs.apply.entity;

import java.util.Set;

public class ApplyStatusValidator {
    private static final Set<String> VALID_STATUSES = Set.of(
            ApplyStatus.APPLIED,
            ApplyStatus.PASSED,
            ApplyStatus.INTERVIEW,
            ApplyStatus.ACCEPTED,
            ApplyStatus.REJECTED
    );

    public static boolean isValid(String status) {
        return VALID_STATUSES.contains(status);
    }
}
