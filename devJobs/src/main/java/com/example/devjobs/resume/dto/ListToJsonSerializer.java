package com.example.devjobs.resume.dto;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.List;

public class ListToJsonSerializer extends JsonSerializer<List<ExperienceDetailDTO>> {

    @Override
    public void serialize(List<ExperienceDetailDTO> value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        ObjectMapper mapper = new ObjectMapper(); // Jackson ObjectMapper 사용
        String jsonString = mapper.writeValueAsString(value); // 리스트를 JSON 문자열로 변환
        gen.writeString(jsonString); // 변환된 문자열을 출력
    }
}