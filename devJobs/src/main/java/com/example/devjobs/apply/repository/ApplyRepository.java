package com.example.devjobs.apply.repository;

import com.example.devjobs.apply.entity.Apply;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ApplyRepository extends JpaRepository<Apply, Integer> {

    List<Apply> findByUserCode(User user);

    // 파라미터를 기초타입x 엔티티타입으로 전달
//    Optional<Apply> findByJobCodeAndUserCode(Integer jobCode, String userCode);
//    Optional<Apply> findByJobCodeAndUserCode(@Param("jobCode") JobPosting jobCode, @Param("userCode") User userCode);

    List<Apply> findByJobCodeAndUserCode(@Param("jobCode") JobPosting jobCode, @Param("userCode") User userCode);

    @Query("SELECT new map(a.userCode.name as name," +
            "a.applyCode as applyCode," +
            "u.email as email, " +
            "j.title as title, " +
            "r.workExperience as workExperience, " +
            "a.createDate as submissionDate, " +
            "a.applyStatus as applyStatus, " +
            "r.resumeCode as resumeCode) " +
            "FROM Apply a " +
            "JOIN a.userCode u " +
            "JOIN a.jobCode j " +
            "JOIN a.resumeCode r " +
            "WHERE j.userCode.userCode = :userCode")
    List<Map<String, Object>> findApplicationsByJobPoster(@Param("userCode") String userCode);

    // 회사 내 지원자 현황 카운트
    @Query("SELECT COUNT(a) " +
            "FROM Apply a " +
            "JOIN a.jobCode j " +
            "WHERE j.userCode.userCode = :userCode")
    Long countTotalApplicationsByUserCode(@Param("userCode") String userCode);

    @Query("SELECT COUNT(a) " +
            "FROM Apply a " +
            "JOIN a.jobCode j " +
            "WHERE j.userCode.userCode = :userCode " +
            "AND a.applyStatus IN ('APPLIED', 'PASSED', 'INTERVIEW')")
    Long countOngoingApplicationsByUserCode(@Param("userCode") String userCode);

    @Query("SELECT COUNT(a) " +
            "FROM Apply a " +
            "JOIN a.jobCode j " +
            "WHERE j.userCode.userCode = :userCode " +
            "AND a.applyStatus IN ('ACCEPTED')")
    Long countFinalApplicationsByUserCode(@Param("userCode") String userCode);


}
