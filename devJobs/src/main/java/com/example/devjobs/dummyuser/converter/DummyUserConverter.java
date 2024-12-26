package com.example.devjobs.dummyuser.converter;

import com.example.devjobs.dummyuser.dto.DummyUserDTO;
import com.example.devjobs.dummyuser.entity.DummyUser;

public class DummyUserConverter {

    // Entity → DTO
    public static DummyUserDTO entityToDto(DummyUser user) {
        return DummyUserDTO.builder()
                .jobCategory(user.getJobCategory())
                .skills(user.getSkills())
                .workExperience(user.getWorkExperience())
                .build();
    }

    // DTO → Entity
    public static DummyUser dtoToEntity(DummyUserDTO dto) {
        return DummyUser.builder()
                .jobCategory(dto.getJobCategory())
                .skills(dto.getSkills())
                .workExperience(dto.getWorkExperience())
                .build();
    }
}