package com.example.devjobs.similarposting.service;

import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.resume.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SimilarPostingServiceImpl implements SimilarPostingService {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Override
    public List<JobPosting> recommendSimilarPostings(Integer resumeCode) {

        // 이력서 정보 조회
        Resume resume = getResumeDetails(resumeCode);

        // 구인 공고 리스트 조회
        List<JobPosting> jobPosting = jobPostingRepository.findAll(); // DB에서 구인 공고 목록 조회

        // 추천 점수 계산
        List<JobPosting> recommendedJobs = new ArrayList<>();
        for (JobPosting job : jobPosting) {
            if (job.isPostingStatus()) { // 모집 중인 공고만 고려
                int matchScore = calculateMatchScore(resume, job);
                if (matchScore >= 5) {  // 5점 이상만 추천
                    job.setMatchScore(matchScore);
                    recommendedJobs.add(job);
                }
            }
        }

        // 추천 공고를 matchScore 내림차순으로 정렬
        recommendedJobs.sort(Comparator.comparingInt(JobPosting::getMatchScore).reversed());

        return recommendedJobs.stream()
                .limit(10) // 추천 공고 10개로 제한
                .collect(Collectors.toList());
    }

    // 추천 점수 계산
    private int calculateMatchScore(Resume resume, JobPosting job) {
        int score = 0;

        // skill match
        score += matchSkills(resume.getSkill(), job.getSkill());

        // Experience match
        score += matchExperience(resume.getWorkExperience(), job.getWorkExperience());

        // Job category match
        if (resume.getJobCategory().equals(job.getJobCategory())) {
            score += 10; // 직무 카테고리 일치 시 점수 부여
        }

        return score;
    }

    // Skill 비교 (쉼표로 구분된 기술 목록을 비교)
    private int matchSkills(String resumeSkills, String jobSkills) {
        List<String> resumeSkillsList = Arrays.asList(resumeSkills.split(","));
        List<String> jobSkillsList = Arrays.asList(jobSkills.split(","));

        int matchCount = 0;
        for (String skill : resumeSkillsList) {
            if(jobSkillsList.contains(skill)) {
                matchCount++;
            }
        }
        return matchCount * 5; // 매칭되는 스킬 수에 비례한 점수 부여
    }

    private int matchExperience(Integer resumeExperience, Integer jobExperience) {
        if (resumeExperience == null || jobExperience == null) {
            return 0; // 경력이 null인 경우 매칭 점수 0 반환
        }
        if (resumeExperience >= jobExperience) {
            return 10;  // 경력이 요구 사항 이상일 경우 점수 부여
        }
        return 0;
    }

    // 이력서 조회
    private Resume getResumeDetails(Integer resumeCode) {
        Optional<Resume> result = resumeRepository.findById(resumeCode);
        if(result.isPresent()) {
            return result.get();
        }
        throw new IllegalArgumentException("이력서를 찾을 수 없습니다.");

    }
}