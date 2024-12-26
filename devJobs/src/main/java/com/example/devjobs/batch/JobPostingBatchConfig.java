package com.example.devjobs.batch;

import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.jobposting.service.JobPostingService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.List;

@Configuration // Spring Batch 설정 클래스
public class JobPostingBatchConfig {

    @Autowired
    private JobRepository jobRepository; // Job 저장소 주입 받기

    @Autowired
    private PlatformTransactionManager transactionManager; // 트랜잭션 관리를 위해 주입 받기

    @Autowired
    private JobPostingRepository jobPostingRepository; // JobPosting 데이터베이스 작업을 처리하기 위해 Repository를 주입받습니다.

    @Autowired
    private JobPostingService jobPostingService; // JobPostingService에서 list출력하기

    // Tasklet: 스텝에서 하나의 작업만 처리하는 방식
    // Tasklet 정의: 마감일이 지난 공고의 상태를 'false'로 변경하는 작업

    // Step1의 Tasklet: 마감된 공고 상태 업데이트
    @Bean
    public Tasklet updateJopPostingStatusTasklet() {
        // chunk : 데이터를 나눠 처리하는 단위 
        // context : 현재 실행중인 프로세스에 대한 정보를 담은 객체
        // contribution : 현재 step의 상태나 진행 상황(작업 상태 업데이트)
        // chunkContext : 현재 chunk와 관련된 정보를 담고있는 컨텍스트(step의 메타데이터)
        return (contribution, chunkContext) -> {
            System.out.println("마감된 공고 상태를 업데이트 중 입니다...");

            LocalDateTime now = LocalDateTime.now();
            
            // 마감일이 현재 시간보다 이전인데 상태가 true인 공고 조회
            List<JobPosting> expriedPostings = jobPostingRepository.findByPostingDeadlineBeforeAndPostingStatusTrue(now);

            // 상태 업데이트
            expriedPostings.forEach(jobPosting ->{
                jobPosting.setPostingStatus(false); // 마감 상태로 변경
                System.out.println("Step1: Update된 공고 코드: " + jobPosting.getJobCode());
            });

            // 변경 사항 저장
            jobPostingRepository.saveAll(expriedPostings);

            return RepeatStatus.FINISHED; // Tasklet 완료

            };

        }

        // Step2의 Tasklet: 업데이트된 공고 출력
        @Bean
        public Tasklet printUpdatedJobPostingsTasklet() {
            return (contribution, chunkContext) -> {

                System.out.println("Step2: 업데이트된 공고 리스트 출력 중...");

                jobPostingService.getList().forEach(jobPosting -> System.out.println("공고 코드: " + jobPosting.getJobCode()));

                return RepeatStatus.FINISHED;
            };
        }

        // Step1 정의
        @Bean
        public Step updateJobPostingStatusStep() {
            return new StepBuilder("updateJobPostingStatusStep", jobRepository)
                    .tasklet(updateJopPostingStatusTasklet(), transactionManager)
                    .build();
        }

        // Step2 정의
        @Bean
        public Step printUpdatedJobPostingsStep() {
            return new StepBuilder("printUpdatedJobPostingsStep", jobRepository)
                    .tasklet(printUpdatedJobPostingsTasklet(), transactionManager)
                    .build();
        }

        // Job 정의: Step1 -> Step2 순서대로 실행
        @Bean
        public Job updateAndPrintJob(JobRepository jobRepository) {
            return new JobBuilder("updateAndPrintJob", jobRepository)
                    .start(updateJobPostingStatusStep()) // step1시작
                    .next(printUpdatedJobPostingsStep()) // step2실행
                    .build();
        }

}
