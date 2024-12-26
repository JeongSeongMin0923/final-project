package com.example.devjobs.similarposting.util;

import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.jobposting.entity.JobPosting;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.jobposting.service.JobPostingService;
import com.example.devjobs.resume.entity.Resume;
import com.example.devjobs.resume.repository.ResumeRepository;
import com.example.devjobs.similarposting.dto.ChatGPTRequestMsg;
import com.example.devjobs.similarposting.dto.GPTRequest;
import com.example.devjobs.similarposting.dto.GPTResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

// GPT API를 호출하기 위한 유틸 클래스

@Service
public class GPTUtil {

    // API 주소와 모델 d
    String apiURL = "https://api.openai.com/v1/chat/completions";

    String model = "gpt-3.5-turbo";

    @Autowired
    ResumeRepository resumeRepository;

//    @Autowired
//    JobPostingRepository jobPostingRepository;

    @Autowired
    JobPostingService jobPostingService;

    // GPT API 인증키
    @Value("${apikey}")
    String secretKey;

    // 매개변수: 질문
    // 리턴값: 답변
    public String apicall(String question) {

        // 필요한 파라미터(질문) 작성
        List<ChatGPTRequestMsg> msglist = new ArrayList<>();
        msglist.add(new ChatGPTRequestMsg("user", question));
//        msglist.add(new ChatGPTRequestMsg("user","자바가 뭐야?"));
//      msglist.add(new ChatGPTRequestMsg("user", "안녕"));

        // 요청 메세지 생성
        GPTRequest requestmsg = new GPTRequest(model, msglist, 300);

        // http 메세지 헤더에 API키와 미디어타입 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // http 통신을 위해 RestTemplate 생성 및 설정
        RestTemplate restTemplate = new RestTemplate();

        HttpEntity<GPTRequest> requestEntity = new HttpEntity<>(requestmsg, headers);

        // API 호출
        ResponseEntity<String> response = restTemplate.exchange(apiURL, HttpMethod.POST, requestEntity, String.class);

        // API 응답 처리
        // json 문자열을 클래스로 변환해주는 매퍼 클래스 생성
        ObjectMapper mapper = new ObjectMapper();

        // 분석할 수 없는 구문을 무시하는 옵션 설정
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // JSON 문자열을 클래스로 변환
        GPTResponse gptResponse = null;
        try {
            gptResponse = mapper.readValue(response.getBody(), GPTResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // 토큰 사용량 출력
        System.out.println("사용한 토큰량:" + gptResponse.usage.totalTokens);

        // GPT 답변 반환
        return gptResponse.choices.get(0).message.content;
    }

    // 매개변수: 이력서 번호
    // 리턴값: API 질문
    // 예시=>
//    구직자의 jobCategory, skill, workExperience를 기준으로 가장 적합한 상위 3개의 구인공고의 jobCode를 추천해줘.
//    구직자정보:{jobCategory=IT/개발, skill=hi,java,spring, workExperience=0}
//    구인공고 목록:[{jobCategory=IT/개발, skill=java, ddd,d d, workExperience=2, jobCode=1}, {jobCategory=zzzzz, skill=Java, workExperience=1, jobCode=2}, {jobCategory=IT, skill=Java, workExperience=20, jobCode=3}, {jobCategory=IT/개발, skill=spring, java, a, workExperience=2, jobCode=5}]
    public List<JobPostingDTO> recommendPostings(int resumeCode){

        // 질문 만들기 start
        StringBuilder builder = new StringBuilder("구직자의 jobCategory, skill, workExperience를 기준으로 가장 적합한 상위 3개의 구인공고의 jobCode를 추천해줘.");

        // 이력서 조회
        Optional<Resume> optional = resumeRepository.findById(resumeCode);
        Resume resume;
        HashMap<String,String> convertResume = new HashMap<>();
        if(optional.isPresent()) {
            resume = optional.get();
            if(resume.getWorkExperience()!=null){
                convertResume.put("workExperience", resume.getWorkExperience().toString());
            } else {
                convertResume.put("workExperience", "0");
            }
            convertResume.put("skill", resume.getSkill());
            convertResume.put("jobCategory", resume.getJobCategory());

            builder.append("구직자정보:");
            builder.append(convertResume);
        }

        // 공고 리스트 조회
        // 질문이 길면 토큰량이 많아져요! 구인공고정보를 요약해주세요!
        List<JobPostingDTO> jobPostingList = jobPostingService.getList();
        List<HashMap<String,String>> convertJob = new ArrayList<>();
        for(JobPostingDTO posting : jobPostingList){
            if (posting.getPostingDeadline().isAfter(LocalDateTime.now())) { // 마감일이 현재 시간보다 이후인지 확인
                HashMap<String, String> map = new HashMap<>();
                map.put("jobCode", posting.getJobCode().toString());
                map.put("workExperience", posting.getWorkExperience().toString());
                map.put("skill", posting.getSkill());
                map.put("jobCategory", posting.getJobCategory());
                map.put("postingStatus", String.valueOf(posting.isPostingStatus()));
                convertJob.add(map);
            }
        }
        builder.append("구인공고 목록: postingStatus가 true인 공고만 출력");
        builder.append(convertJob);

        builder.append("답변은 오로지 숫자만 해줘. 예시) 1,2,3");
        System.out.println(builder);
        // 질문 만들기 end

        // 위에서 만들 질문으로 API 호출
        String answer = apicall(builder.toString());
        System.out.println(answer);

        // 답변
        String[] arr = answer.split(",");

        // 답변에 해당하는 구인공고 리스트
        List<JobPostingDTO> result = new ArrayList<>();

        for(String code : arr){
            for(JobPostingDTO job : jobPostingList){
                if(job.getJobCode() == Integer.parseInt(code.trim())){

                    result.add(job);
                }
            }
        }

        return result;
    }

}

