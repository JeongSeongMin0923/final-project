package com.example.devjobs.jobcategory.service;

import com.example.devjobs.jobcategory.dto.JobCategoryDTO;
import com.example.devjobs.jobcategory.entity.JobCategory;
import com.example.devjobs.jobcategory.repository.JobCategoryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobCategoryServiceImpl implements JobCategoryService {

    @Autowired
    private JobCategoryRepository repository;

    // 애플리케이션 시작 시 직무 카테고리 초기화
    @PostConstruct
    public void initJobCategory() {
        if (repository.count() == 0) { // 데이터가 없으면 고정된 값들로 초기화
            List<JobCategory> categories = Arrays.asList(
                new JobCategory(null, "백엔드 개발자"),
                new JobCategory(null, "프론트엔드 개발자"),
                new JobCategory(null, "풀스택 개발자"),
                new JobCategory(null, "데이터 과학자"),
                new JobCategory(null, "게임 개발자"),
                new JobCategory(null, "모바일앱 개발자"),
                new JobCategory(null, "데브옵스 엔지니어"),
                new JobCategory(null, "임베디드 엔지니어"),
                new JobCategory(null, "클라우드 엔지니어"),
                new JobCategory(null, "시큐리티 엔지니어")
            );
            repository.saveAll(categories);
            System.out.println("직무 카테고리 초기화 완료");
        }
    }


    @Override
    public int register(JobCategoryDTO dto) {

        JobCategory entity = dtoToEntity(dto);

        repository.save(entity);

        return entity.getCategoryCode();
    }

    @Override
    public List<JobCategoryDTO> getList() {
        List<JobCategory> entityList = repository.findAll();
        List<JobCategoryDTO> dtoList = entityList.stream()
                .map(entity -> entityToDto(entity))
                .collect(Collectors.toList());
        return dtoList;
    }

    @Override
    public void modify(JobCategoryDTO dto) {
        Optional<JobCategory> result = repository.findById(dto.getCategoryCode());
        if (result.isPresent()) {
            JobCategory entity = result.get();
            entity.setCategoryName(dto.getCategoryName());
            repository.save(entity);
        }
    }

    @Override
    public void remove(int code) {
        repository.deleteById(code);
    }

}
