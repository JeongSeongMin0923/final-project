package com.example.devjobs.batch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component // 스프링 컴포넌트로 등록
public class JobPostingBatchScheduler {

    @Autowired
    private JobLauncher jobLauncher; // 배치 작업 실행을 위한 JobLauncher

    @Autowired
    private Job updateAndPrintJob; // Job 정의


//    @Scheduled(cron = "*/5 * * * * *") // 5초마다 실행
    @Scheduled(cron = "0 */5 * * * *") // cron 표현식: 매 분 0초에 실행 // 스케쥴러 설정: 매 5분마다 실행
    public void runBatchJob() {
        try{
            System.out.println("스케쥴러: 마감된 공고 찾고 있는 중...");

            // Job 실행 시 파라미터 추가 (현재 시간을 파라미터로 전달)
            // Job 실행 시 매번 새로운 JobParameters를 전달하여 중복 실행 방지(실행 시간 파라미터로)
            jobLauncher.run(updateAndPrintJob, new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis()) // 실행 시간 파라미터 추가
                    .toJobParameters());

            System.out.println("스케쥴러: 마감공고 Job 실행 완료.");

        } catch (Exception e) {
            System.out.println("스케쥴러: 마감공고 Job 실행 중 오류 발생 - " + e.getMessage());
        }
    }

}
