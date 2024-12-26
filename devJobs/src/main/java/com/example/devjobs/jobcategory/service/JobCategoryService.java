package com.example.devjobs.jobcategory.service;

import com.example.devjobs.jobcategory.dto.JobCategoryDTO;
import com.example.devjobs.jobcategory.entity.JobCategory;
import org.springframework.stereotype.Service;

import java.util.List;

public interface JobCategoryService {

    int register(JobCategoryDTO dto);

    List<JobCategoryDTO> getList();

    void modify(JobCategoryDTO dto);

    void remove(int code);

    default JobCategory dtoToEntity(JobCategoryDTO dto) {
        JobCategory entity = JobCategory.builder()
                .categoryCode(dto.getCategoryCode())
                .categoryName(dto.getCategoryName())
                .build();

        return entity;
    }

    default JobCategoryDTO entityToDto(JobCategory entity) {
        JobCategoryDTO dto = JobCategoryDTO.builder()
                .categoryCode(entity.getCategoryCode())
                .categoryName(entity.getCategoryName())
                .build();

        return dto;
    }

}
