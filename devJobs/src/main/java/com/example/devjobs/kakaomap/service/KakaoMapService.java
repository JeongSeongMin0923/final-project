package com.example.devjobs.kakaomap.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;

@Service
public class KakaoMapService {

    // 카카오 지도 REST API URL (주소 → 좌표 변환 API)
    private static final String KAKAO_API_URL = "https://dapi.kakao.com/v2/local/search/address.json";
    private static final String KAKAO_API_KEY = "ec2872b5f4232ba6697a36308bbc99bd";

    /**
     * 입력된 주소를 기반으로 카카오 지도 API를 호출하여 좌표를 반환하는 메서드
     *
     * @param address 사용자가 요청한 주소
     * @return API 응답(JSON 형식의 문자열)
     */
    public String getCoordinates(String address) {
        // Spring에서 제공하는 REST API 클라이언트 객체 생성
        RestTemplate restTemplate = new RestTemplate();

        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();

        // Authorization 헤더에 REST API 키 추가
        headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);

        // 요청 URL 생성 (주소를 query 파라미터로 포함)
        String url = KAKAO_API_URL + "?query=" + address;

        // HTTP 요청 엔티티 생성 (헤더만 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 요청 URL과 헤더 출력
            System.out.println("Kakao API Request URL: " + url);
            System.out.println("Kakao API Request Headers: " + headers);

            // REST API 호출 (GET 요청)
            ResponseEntity<String> response = restTemplate.exchange(
                    url,                             // 요청 URL
                    org.springframework.http.HttpMethod.GET, // HTTP 메서드 (GET)
                    entity,                          // HTTP 요청 엔티티
                    String.class                     // 응답 타입 (String)
            );

            // 응답 상태 코드와 본문 출력
            System.out.println("Kakao API Response Status: " + response.getStatusCode());
            System.out.println("Kakao API Response Body: " + response.getBody());

            // API 응답 본문(JSON 문자열) 반환
            return response.getBody();
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 출력
            System.err.println("Kakao API Request Failed: " + e.getMessage());
            throw new RuntimeException("카카오 API 요청 중 오류 발생: " + e.getMessage());

        }
    }
}
