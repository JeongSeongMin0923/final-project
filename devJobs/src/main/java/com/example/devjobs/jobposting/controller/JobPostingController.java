package com.example.devjobs.jobposting.controller;

import com.example.devjobs.jobposting.dto.JobPostingDTO;
import com.example.devjobs.jobposting.repository.JobPostingRepository;
import com.example.devjobs.jobposting.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/jobposting")
public class JobPostingController {

    @Autowired
    private JobPostingService service;

    @Autowired
    private JobPostingRepository repository;

    // 전체 공고 카운트
    @GetMapping("/countall")
    public ResponseEntity<Long> countAllJobPostings() {
        return ResponseEntity.ok(service.countAllJobPostings());
    }

    // 진행중인 공고
    @GetMapping("/countactive")
    public ResponseEntity<Long> countActiveJobPostings() {
        return ResponseEntity.ok(service.countActiveJobPostings());
    }

    // 이름 추출
    @GetMapping("/company-names")
    public ResponseEntity<List<String>> getCompanyNames() {
        List<String> companyNames = service.getCompanyNamesFromJobPostings();
        return ResponseEntity.ok(companyNames);
    }

    @PostMapping("/register")
    public ResponseEntity<Integer> register(
            JobPostingDTO dto,
            @RequestParam(value = "uploadFile", required = false) MultipartFile uploadFile) {
        try {
            System.out.println("Incoming DTO: " + dto);
            System.out.println("Incoming File: " + (uploadFile != null ? uploadFile.getOriginalFilename() : "No File"));

            int no = service.register(dto, uploadFile);
            System.out.println("JobPosting registered with ID: " + no);

            return new ResponseEntity<>(no, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error during JobPosting registration: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<JobPostingDTO>> list() {
        List<JobPostingDTO> list = service.getList();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/read")
    public ResponseEntity<JobPostingDTO> read(@RequestParam(name = "no") Integer no) {

        System.out.println("직업코드: " + no);

        JobPostingDTO dto = service.read(no);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PatchMapping("/modify")
    public ResponseEntity<String> modifyPartial(
            @RequestParam(required = false) Integer jobCode,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String recruitJob,
            @RequestParam(required = false) Integer recruitField,
            @RequestParam(required = false) String salary,
            @RequestParam(required = false) Boolean postingStatus,
            @RequestParam(required = false) Integer workExperience,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) MultipartFile uploadFile,
            @RequestParam(required = false) LocalDateTime lastUpdated,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String address, // 추가된 주소 필드
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime postingDeadline
    ) {
        try {

            // 서비스 계층 호출
            service.modify(jobCode, title, content, recruitJob, recruitField, salary,
                    postingStatus, workExperience, tag, jobCategory, skill, postingDeadline, uploadFile, LocalDateTime.now(), address);

            return new ResponseEntity<>("JobPosting updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update JobPosting.", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/remove/{code}")
    public ResponseEntity remove(@PathVariable("code") Integer code) {
        service.remove(code);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


    @GetMapping("/{jobCode}/company-profile-code")
    public ResponseEntity<Integer> getCompanyProfileCode(@PathVariable Integer jobCode) {
        Integer companyProfileCode = service.getCompanyProfileCodeByJobCode(jobCode);
        return ResponseEntity.ok(companyProfileCode);
    }
}
