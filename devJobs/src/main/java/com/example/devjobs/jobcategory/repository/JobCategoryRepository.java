package com.example.devjobs.jobcategory.repository;

import com.example.devjobs.jobcategory.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Integer> {

}
