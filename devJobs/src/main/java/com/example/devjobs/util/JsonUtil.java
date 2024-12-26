package com.example.devjobs.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class JsonUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // List -> JSON 변환
    public static String convertListToJson(List<?> list) {
        try {
            if (list != null) {
                return objectMapper.writeValueAsString(list); // List를 JSON 문자열로 변환
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("List to JSON 변환 실패", e);
        }
        return null;
    }

    // JSON -> List 변환
    public static <T> List<T> convertJsonToList(String json, Class<T> clazz) {
        try {
            if (json != null && !json.isEmpty()) {
                return objectMapper.readValue(json,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, clazz)); // JSON 문자열을 List로 변환
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON to List 변환 실패", e);
        }
        return null;
    }
}
