package com.example.devjobs.resume.controller;

import com.example.devjobs.resume.dto.ResumeDTO;
import com.example.devjobs.resume.repository.ResumeRepository;
import com.example.devjobs.resume.service.ResumeService;
import com.example.devjobs.util.FileUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService service;

    @Autowired

    private ResumeRepository repository;

    @Autowired
    private FileUtil fileUtil;

    @PostMapping("/register")
    public ResponseEntity<Integer> register(
            @RequestPart("dto") String dtoJson,
            @RequestPart(value = "resumeFolder", required = false) MultipartFile resumeFolder
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ResumeDTO dto = objectMapper.readValue(dtoJson, ResumeDTO.class);

            // 강제로 resumeCode를 null로 설정
            dto.setResumeCode(null);

            if (resumeFolder != null && !resumeFolder.isEmpty()) {
                dto.setUploadFileName(resumeFolder.getOriginalFilename());
            }

            int no = service.register(dto, resumeFolder);
            return new ResponseEntity<>(no, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping("/list")
//    public ResponseEntity<List<ResumeDTO>> list(){
//        List<ResumeDTO> list = service.getList();
//        return new ResponseEntity<>(list, HttpStatus.OK);
//
//    }

    @GetMapping("/list")
    public List<ResumeDTO> getResumesByUserCode(@RequestParam("userCode") String userCode) {
        // userCode를 기준으로 Resume 리스트 조회
        return service.getResumesByUserCode(userCode);
    }

    // @requestparam보다는 @pathvariable이 적합(restful api설계 원칙에 부합)
    @GetMapping("/read/{code}")
    public ResponseEntity<ResumeDTO> read(@PathVariable int code){

        System.out.println("이력서코드:" + code);

        ResumeDTO dto = service.read(code);
        return new ResponseEntity<>(dto, HttpStatus.OK);

    }

    //    @PatchMapping("/modify")
//    public ResponseEntity<String> modify(
//            @RequestParam(required = false) Integer resumeCode,         // 이력서 코드
//            @RequestParam(required = false) Integer workExperience,    // 경력
//            @RequestParam(required = false) String education,          // 학력
//            @RequestParam(required = false) String skill,              // 스킬
//            @RequestParam(required = false) String jobCategory,        // 직무
//            @RequestParam(required = false) String certifications,     // 자격증
//            @RequestParam(required = false) String languageSkills,     // 언어 능력
//            @RequestParam(required = false) String introduce,          // 자기소개
//            @RequestParam(required = false) String work,               // 담당업무
//            @RequestParam(required = false) String link,               // 링크
//            @RequestParam(required = false) String experienceDetail,   // 세부 경력
//            @RequestParam(required = false) MultipartFile uploadFileName, // 이력서 파일
//            @RequestParam(required = false) LocalDateTime lastUpdated  // 마지막 수정일
//    ) {
    @PatchMapping("/modify")
    public ResponseEntity<String> modify(@RequestParam(required = false) String dtoJson, @RequestParam(required = false) MultipartFile uploadFile) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        ResumeDTO dto = objectMapper.readValue(dtoJson, ResumeDTO.class);

        if (dto.getResumeCode() == null) {
            return new ResponseEntity<>("Resume Code is required.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 서비스 메소드 호출
            service.modify(dto, uploadFile);

            return new ResponseEntity<>("Resume updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update resume.", HttpStatus.BAD_REQUEST);
        }

    }

    @DeleteMapping("/remove/{code}")
    public ResponseEntity remove(@PathVariable("code") int code){
        service.remove(code);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


    // 이력서 개수 카운트하는 API
    @GetMapping("/count")
    public ResponseEntity<Long> getResumeCount(@RequestParam String userCode) {
        System.out.println("UserCode: " + userCode);
        long count = service.getResumeCount(userCode);
        System.out.println("Resume Count: " + count);
        return ResponseEntity.ok(count);
    }


}
