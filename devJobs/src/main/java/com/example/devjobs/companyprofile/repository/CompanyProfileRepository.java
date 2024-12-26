package com.example.devjobs.companyprofile.repository;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Integer> {

    CompanyProfile findByUser(User user);

    Optional<CompanyProfile> findByUser_UserCode(String userCode);


    // 특정 회사의 모든 공고 조회 (유저)
    @Query("SELECT j FROM JobPosting j WHERE j.companyProfile.companyProfileCode = :companyProfileCode")
    List<JobPosting> findJobPostingsByCompanyProfileCode(@Param("companyProfileCode") Integer companyProfileCode);

    // 기업페이지 내 모든 공고 조회 (기업)
    @Query("SELECT j FROM JobPosting j WHERE j.userCode.userCode = :userCode")
    List<JobPosting> findJobPostingsByUserCode(@Param("userCode") String userCode);

//    // 특정 회사(CompanyProfile)에 해당하는 공고 개수 세기
//    @Query("SELECT COUNT(j) FROM JobPosting j WHERE j.userCode.userCode = :userCode")
//    Long countJobPostingsByUserCode(@Param("userCode") String userCode);



}
