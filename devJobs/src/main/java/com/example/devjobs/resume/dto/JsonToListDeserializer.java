package com.example.devjobs.resume.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

public class JsonToListDeserializer extends JsonDeserializer<List<ExperienceDetailDTO>> {

    @Override
    public List<ExperienceDetailDTO> deserialize(JsonParser jsonParser, DeserializationContext context) throws IOException {
        ObjectMapper mapper = (ObjectMapper) jsonParser.getCodec();
        String json = jsonParser.getText(); // JSON 문자열을 가져옴
        return mapper.readValue(json, new TypeReference<List<ExperienceDetailDTO>>() {});
    }
}
