    package com.example.devjobs.resume.service;

    import com.example.devjobs.jobposting.dto.JobPostingDTO;
    import com.example.devjobs.resume.dto.*;
    import com.example.devjobs.resume.entity.Resume;
    import com.example.devjobs.user.entity.User;
    import com.example.devjobs.util.JsonUtil;
    import org.springframework.web.multipart.MultipartFile;

    import java.time.LocalDateTime;
    import java.util.List;

    public interface ResumeService {

        // userCode를 기반으로 Resume 리스트 조회
        List<ResumeDTO> getResumesByUserCode(String userCode);

        int register(ResumeDTO dto, MultipartFile resumeFolder);

        List<ResumeDTO> getList();

        ResumeDTO read(Integer resumeCode);

        // 이력서 수정 메소드 추가
        void modify(ResumeDTO dto, MultipartFile resumeFolder);

        void remove(Integer resumeCode);

        // userCode로 이력서 개수 찾기
        long getResumeCount(String userCode);

        // 자격증, 언어능력 >> List에서 Json으로 변환 필요 (DB에 JSON 형태로로 저장) 직렬화?
        default Resume dtoToEntity(ResumeDTO dto) {

            User user = new User();
            user.setUserCode(dto.getUserCode());

            Resume entity = Resume.builder()
                    .resumeCode(dto.getResumeCode())                     // 이력서 코드
                    .workExperience(dto.getWorkExperience())         // 경력
                    .introduce(dto.getIntroduce()) // 자기소개글
                    .link(dto.getLink()) // 링크
                    .work(dto.getWork()) // 담당업무
                    .experienceDetail(JsonUtil.convertListToJson(dto.getExperienceDetail())) // 세부경력(json)
                    .education(JsonUtil.convertListToJson(dto.getEducation()))            // 학력 (JSON)
                    .certifications(JsonUtil.convertListToJson(dto.getCertifications()))  // 자격증 JSON으로 변환
                    .skill(dto.getSkill())                           // 스킬
                    .jobCategory(dto.getJobCategory())              // 직무
                    .languageSkills(JsonUtil.convertListToJson(dto.getLanguageSkills()))  // 언어능력 JSON으로 변환
                    .uploadFileName(dto.getUploadFileName())         // 이력서 파일
                    .userCode(user) // 유저코드
                    .build();

            return entity;
        }

        // 자격증, 언어능력 >> JSON에서 List로(DTO에 List형태로 되어있기에)
        default ResumeDTO entityToDTO(Resume entity) {
            ResumeDTO dto = ResumeDTO.builder()
                    .resumeCode(entity.getResumeCode())                      // 이력서 코드
                    .workExperience(entity.getWorkExperience())          // 경력
                    .work(entity.getWork()) // 담당업무
                    .introduce(entity.getIntroduce()) // 자기소개
                    .link(entity.getLink()) // 링크
                    .experienceDetail(JsonUtil.convertJsonToList(entity.getExperienceDetail(), ExperienceDetailDTO.class)) // 세부경력 JSON -> List
                    .education(JsonUtil.convertJsonToList(entity.getEducation(), EducationDTO.class))              // 학력 JSON -> List
                    .certifications(JsonUtil.convertJsonToList(entity.getCertifications(), CertificationsDTO.class))    // 자격증 JSON -> List
                    .skill(entity.getSkill())                            // 스킬
                    .jobCategory(entity.getJobCategory())               // 직무
                    .languageSkills(JsonUtil.convertJsonToList(entity.getLanguageSkills(), LanguagesSkillsDTO.class)) // 언어 능력 JSON -> List
                    .uploadFileName(entity.getUploadFileName())          // 이력서 파일
                    .createDate(entity.getCreateDate())                // 생성일
                    .updateDate(entity.getUpdateDate())                // 수정일
                    .userCode(entity.getUserCode().getUserCode())
                    .build();

            return dto;
        }

    }
