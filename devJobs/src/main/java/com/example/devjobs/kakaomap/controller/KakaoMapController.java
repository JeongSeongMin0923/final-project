package com.example.devjobs.kakaomap.controller;

import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.service.JobPostingService;
import com.example.devjobs.kakaomap.service.KakaoMapService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

// React에서 호출하는 컨트롤러
@RestController
@RequestMapping("/kakao-map")
public class KakaoMapController {

    @Autowired
    private KakaoMapService kakaoMapService;

    @Autowired
    private JobPostingService jobPostingService;

    /**
     * 주소를 받아 좌표를 반환
     * @param jobCode 구인 공고 코드
     * @return 위도 및 경도 정보
     */
    @GetMapping("/coordinates/{jobCode}")
    public ResponseEntity<?> getCoordinatesForJobPosting(@PathVariable Integer jobCode) {
        Optional<JobPosting> jobPostingOptional = jobPostingService.getbyId(jobCode);
        if (jobPostingOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("구인공고를 찾을 수 없습니다.");
        }

        JobPosting jobPosting = jobPostingOptional.get();
        if (jobPosting.getAddress() == null || jobPosting.getAddress().isEmpty()) {
            return ResponseEntity.badRequest().body("구인공고에 등록된 주소를 찾을 수 없습니다");
        }

        try {
            // KakaoMapService에서 좌표 정보(JSON 문자열) 가져오기
            String coordinatesJson = kakaoMapService.getCoordinates(jobPosting.getAddress());

            // JSON 문자열을 실제 JSON 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            Object json = objectMapper.readValue(coordinatesJson, Object.class);

            // JSON 객체를 응답
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 반환
            return ResponseEntity.status(500).body("Failed to fetch coordinates: " + e.getMessage());
        }
    }
}
