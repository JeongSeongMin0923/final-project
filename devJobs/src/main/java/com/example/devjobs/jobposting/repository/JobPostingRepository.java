package com.example.devjobs.jobposting.repository;

import com.example.devjobs.jobposting.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Integer> {

    // 공고마감일이 현재 시간 이전이고, 공고상태가 true인 공고 조회(batch)
    List<JobPosting> findByPostingDeadlineBeforeAndPostingStatusTrue(LocalDateTime now);

    // [전체 공고] 카운트(admin용)
    @Query("SELECT COUNT(jp) FROM JobPosting jp")
    long countAllJobPostings();

    // [진행 중인 공고] 카운트(admin용)
    @Query("SELECT COUNT(jp) FROM JobPosting jp WHERE jp.postingStatus = true")
    long countActiveJobPostings();

    // 회사이름 가져오는 쿼리
    @Query(value = "SELECT cp.company_name " +
                    "FROM job_posting jp " +
                    "INNER JOIN company_profile cp ON jp.company_profile_code = cp.company_profile_code",
                    nativeQuery = true)
    List<String> findCompanyNamesByJobPostings();
}
