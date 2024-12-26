import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import {
  GlobalStyle,
  Container,
  Title,
  Form,
  FormGroup,
  Input,
  Button,
  FullWidthWrapper,
  DevSection,
  AddButtonLarger,
  DeleteButton,
  DevWrapper,
  QuillWrapper,
} from "../../styles/ResumeStyles";
import { useApiHost } from '../../context/ApiHostContext';
import { useAuth } from '../../pages/AuthContent'

// const name = localStorage.getItem("name"); // 로컬 스토리지에 name이 없으면 null 또는 undefined가 반환

const ResumePosting = ({ onSubmit }) => {

  const { name } = useAuth();
  const [placeholder, setPlaceholder] = useState('새로운 이력서');

  useEffect(() => {
    if (name) {
      setPlaceholder(`${name}님의 이력서`);
    }
  }, [name]);

  const { API_HOST } = useApiHost();

  const navigate = useNavigate();

  console.log("onSubmit prop:", onSubmit); // 컴포넌트가 렌더링될 때 전달된 onSubmit을 출력
  // 상태 관리
  const [introduce, setIntroduce] = useState(""); // 소개글
  const [work, setWork] = useState(""); // 제목
  const [link, setLink] = useState(""); // 링크
  const [workExperience, setWorkExperience] = useState(""); // 경력(년차)
  const [experienceDetail, setexperienceDetail] = useState([
    { company: "", department: "", startDate: "", endDate: "", position: "", responsibility: "", salary: "" },
  ]); // 세부 경력
  const [education, setEducation] = useState([
    { date: "", school: "", major: "" },
  ]); // 학력
  const [certifications, setCertifications] = useState([
    { certificationName: "", issueDate: "", issuer: "" },
  ]); // 자격증
  const [languageSkills, setLanguageSkills] = useState([
    { language: "", level: "" },
  ]); // 언어 능력
  const [skill, setSkill] = useState(""); // 기술
  const [jobCategory, setJobCategory] = useState(""); // 직무
  const [resumeFolder, setResumeFolder] = useState(null); // 파일 업로드

  const token = localStorage.getItem("token"); // 인증 토큰

  // 범용 필드 업데이트 핸들러
  const handleFieldChange = (index, field, value, setter) => {
    setter((setter) => {
      const updatedData = [...setter]; // 현재 상태 배열 복사
      updatedData[index][field] = value; // 특정 인덱스의 필드를 업데이트
      return updatedData; // 업데이트된 배열로 상태를 갱신
    });
  };

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    setResumeFolder(e.target.files[0]);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // introduce에서 <p> 태그 제거
    const sanitizedIntroduce = introduce.replace(/<p>|<\/p>/g, ''); // <p> 태그 제거

    // DTO 데이터 생성
    const dto = {
      introduce: sanitizedIntroduce, // <p>태그 제거
      work,
      link,
      workExperience: Number(workExperience),
      experienceDetail: experienceDetail,
      education,
      certifications,
      languageSkills,
      skill,
      jobCategory,
    };

    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto)); // DTO를 JSON 문자열로 직렬화
    if (resumeFolder) {
      formData.append("resumeFolder", resumeFolder); // 파일 추가
    }

    try {
      const response = await axios.post(
        `${API_HOST}/resume/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("이력서가 성공적으로 등록되었습니다.");
        onSubmit(dto);
        navigate("/resumes/list");
        return;
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("이력서 등록에 실패했습니다.");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>이력서 등록</Title>

        {/* 담당 업무 */}
        <FormGroup label="담당 업무">
          <FullWidthWrapper>
            <Input
              type="text"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              // placeholder={`${name}님의 이력서`} 
              placeholder={placeholder}
            />
          </FullWidthWrapper>
        </FormGroup>
        <Form onSubmit={handleSubmit}>

          {/* 소개글 */}
          <FormGroup label="소개글">
            <QuillWrapper>
              <ReactQuill
                theme="snow"
                value={introduce}
                onChange={(value) => setIntroduce(value)} // HTML 포함 상태 유지
                placeholder="자기소개를 입력하세요."
              />
            </QuillWrapper>
          </FormGroup>

          {/* 세부 경력 */}
          경력
          <FormGroup label="세부 경력">
            {/* 상단 경력 추가 버튼 */}
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  setexperienceDetail([
                    ...experienceDetail,
                    {
                      company: "",
                      department: "",
                      startDate: "",
                      endDate: "",
                      position: "",
                      responsibility: "",
                      salary: "",
                    },
                  ])
                }
              >
                + 경력 추가
              </AddButtonLarger>
            </DevSection>

            {/* 경력 항목 리스트 */}
            {experienceDetail.map((detail, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={detail.company}
                    onChange={(e) => handleFieldChange(index, "company", e.target.value, setexperienceDetail)}
                    placeholder="회사명"
                  />
                  <Input
                    type="text"
                    value={detail.department}
                    onChange={(e) => handleFieldChange(index, "department", e.target.value, setexperienceDetail)}
                    placeholder="부서명"
                  />
                  <Input
                    type="text"
                    value={detail.startDate}
                    onChange={(e) => handleFieldChange(index, "startDate", e.target.value, setexperienceDetail)}
                    placeholder="입사일"
                  />
                  <Input
                    type="text"
                    value={detail.endDate}
                    onChange={(e) => handleFieldChange(index, "endDate", e.target.value, setexperienceDetail)}
                    placeholder="퇴사일"
                  />
                  <Input
                    type="text"
                    value={detail.position}
                    onChange={(e) => handleFieldChange(index, "position", e.target.value, setexperienceDetail)}
                    placeholder="직급"
                  />
                  <Input
                    type="text"
                    value={detail.responsibility}
                    onChange={(e) => handleFieldChange(index, "responsibility", e.target.value, setexperienceDetail)}
                    placeholder="담당 업무"
                  />
                  <Input
                    type="text"
                    value={detail.salary}
                    onChange={(e) => handleFieldChange(index, "salary", e.target.value, setexperienceDetail)}
                    placeholder="연봉"
                  />

                  {/* 삭제 버튼 */}
                  <DeleteButton
                    type="button"
                    onClick={() => {
                      const updatedDetails = experienceDetail.filter((_, i) => i !== index); // index를 기준으로 항목 제외
                      setexperienceDetail(updatedDetails); // 상태 업데이트
                    }}
                  >
                    ×
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 자격증 */}
          자격증
          <FormGroup label="자격증">
            {/* 상단 자격증 추가 버튼 */}
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  setCertifications([
                    ...certifications,
                    { certificationName: "", issueDate: "", issuer: "" },
                  ])
                }
              >
                + 자격증 추가
              </AddButtonLarger>
            </DevSection>

            {/* 자격증 항목 리스트 */}
            {certifications.map((certification, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={certification.certificationName}
                    onChange={(e) =>
                      handleFieldChange(index, "certificationName", e.target.value, setCertifications)
                    }
                    placeholder="자격증명"
                  />
                  <Input
                    type="text"
                    value={certification.issueDate}
                    onChange={(e) =>
                      handleFieldChange(index, "issueDate", e.target.value, setCertifications)
                    }
                    placeholder="발급일"
                  />
                  <Input
                    type="text"
                    value={certification.issuer}
                    onChange={(e) =>
                      handleFieldChange(index, "issuer", e.target.value, setCertifications)
                    }
                    placeholder="발급기관"
                  />
                  <DeleteButton
                    type="button"
                    onClick={() =>
                      setCertifications(certifications.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          언어
          {/* 언어 능력 */}
          <FormGroup label="언어 능력">
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  setLanguageSkills([
                    ...languageSkills,
                    { language: "", level: "" },
                  ])
                }
              >
                + 언어 능력 추가
              </AddButtonLarger>
            </DevSection>

            {languageSkills.map((languageSkill, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={languageSkill.language}
                    onChange={(e) =>
                      handleFieldChange(index, "language", e.target.value, setLanguageSkills)
                    }
                    placeholder="언어"
                  />
                  <Input
                    type="text"
                    value={languageSkill.level}
                    onChange={(e) =>
                      handleFieldChange(index, "level", e.target.value, setLanguageSkills)
                    }
                    placeholder="능력 수준 (예: 유창함, 비즈니스 회화, 일상 회화)"
                  />
                  <DeleteButton
                    type="button"
                    onClick={() =>
                      setLanguageSkills(languageSkills.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 학력 */}
          <FormGroup label="학력">
            학력
            {education.map((edu, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleFieldChange(index, "school", e.target.value, setEducation)}
                    placeholder="학교명"
                  />
                  <Input
                    type="text"
                    value={edu.major}
                    onChange={(e) => handleFieldChange(index, "major", e.target.value, setEducation)}
                    placeholder="전공"
                  />
                  <Input
                    type="text"
                    value={edu.date}
                    onChange={(e) => handleFieldChange(index, "date", e.target.value, setEducation)}
                    placeholder="날짜"
                  />
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          링크
          {/* 링크 */}
          <FormGroup label="링크">
            <FullWidthWrapper>
              <Input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="깃허브 또는 포트폴리오 링크를 입력하세요."
              />
            </FullWidthWrapper>
          </FormGroup>

          경력
          {/* 경력 */}
          <FormGroup label="경력(년차)">
            <FullWidthWrapper>
              <Input
                type="number"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                placeholder="경력(년차)을 입력하세요."
              />
            </FullWidthWrapper>
          </FormGroup>

          {/* 기술 스택 */}
          스킬
          <FormGroup label="기술 스택">
            <FullWidthWrapper>
              <Input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="사용 가능한 기술 스택을 입력하세요. (java, spring, react...)"
              />
            </FullWidthWrapper>
          </FormGroup>

          {/* 직무 setJobCategory */}
          직무
          <FormGroup label="직무">
            <FullWidthWrapper>
              <Input
                type="text"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
                placeholder="직무를 입력하세요 (백엔드 개발자...)"
              />
            </FullWidthWrapper>
          </FormGroup>


          {/* 파일 업로드 */}
          이력서 첨부
          <FormGroup label="이력서 파일">
            <FullWidthWrapper>
              <Input type="file" accept=".pdf" onChange={handleFileChange} />
            </FullWidthWrapper>
          </FormGroup>

          <Button type="submit">등록</Button>
        </Form>
      </Container>
    </>
  );
};


ResumePosting.propTypes = {
  onSubmit: PropTypes.func,
};

ResumePosting.defaultProps = {
  onSubmit: () => { }, // 빈 함수 설정(이력서 등록 실패 방지)
};

export default ResumePosting;