import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import {
  GlobalStyle,
  Container,
  Title,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FullWidthWrapper,
  DevSection,
  AddButtonLarger,
  DeleteButton,
  DevWrapper,
  QuillWrapper,
} from "../../styles/ResumeStyles";
import { useApiHost } from '../../context/ApiHostContext';

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false, // 기본 블록 태그를 <p>에서 <div>로 변경
  },
};

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 24px;
`;

const ResumeEdit = () => {
  const { resumeCode } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { API_HOST } = useApiHost();

  const [board, setBoard] = useState({
    introduce: '',
    work: '',
    link: '',
    workExperience: '',
    experienceDetail: [{ company: "", department: "", startDate: "", endDate: "", position: "", responsibility: "", salary: "" }],
    education: [{ date: '', school: '', major: '' }],
    certifications: [{ certificationName: '', issueDate: '', issuer: '' }],
    languageSkills: [{ language: '', level: '' }],
    skill: '',
    jobCategory: '',
    resumeFolder: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiCall = async () => {
      try {
        const response = await axios.get(`${API_HOST}/resume/read/${resumeCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;

          // 기본값 보장
          setBoard((prev) => ({
            ...data,
            experienceDetail: data.experienceDetail || [], // undefined 방지
            education: data.education || [], // 추가로 다른 항목도 확인
            resumeFolder: data.uploadFileName || "", // 파일 경로로 매핑
            resumeFolderName: data.uploadFileName?.split("/").pop() || "다운로드", // 파일 이름 추출
          }));

        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    apiCall();
  }, [resumeCode, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBoard((prev) => ({
        ...prev,
        resumeFolder: file, // 새 파일로 덮어쓰기
        resumeFolderName: file.name, // 파일 이름 업데이트
      }));
    }
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setBoard((prevBoard) => ({
  //     ...prevBoard,
  //     [name]: value,
  //   }));
  // };

  const handleArrayChange = (index, field, value, arrayName) => {
    setBoard((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAdd = (newItem, arrayName) => {
    setBoard((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem],
    }));
  };

  const handleDelete = (index, arrayName) => {
    setBoard((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 저장하기 전에 <p> 태그 제거
    const sanitizedIntroduce = board.introduce.replace(/<p>|<\/p>/g, '');

    const dto = {
      resumeCode: parseInt(resumeCode, 10),
      introduce: sanitizedIntroduce,
      work: board.work,
      link: board.link,
      workExperience: parseInt(board.workExperience, 10),
      experienceDetail: board.experienceDetail,
      education: board.education,
      certifications: board.certifications,
      languageSkills: board.languageSkills,
      skill: board.skill,
      jobCategory: board.jobCategory,
    };

    const formData = new FormData();
    formData.append("dtoJson", JSON.stringify(dto));
    if (board.resumeFolder instanceof File) {
      formData.append("uploadFile", board.resumeFolder); // 새 파일 전송
    }
    try {
      const response = await axios.patch(
        `${API_HOST}/resume/modify`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('이력서가 성공적으로 수정되었습니다.');
        const updatedData = response.data;
        setBoard((prev) => ({
          ...prev,
          ...updatedData
        }));
        navigate(`/resumes/${resumeCode}`);
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingText>이력서 정보를 불러오는 중...</LoadingText>
      </LoadingOverlay>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>이력서 수정</Title>
        <Form onSubmit={handleSubmit}>

          {/* 담당 업무 */}
          <FormGroup label="담당 업무">
            <FullWidthWrapper>
              <Input
                type="text"
                value={board.work || ""}
                onChange={(e) =>
                  setBoard((prev) => ({ ...prev, work: e.target.value }))
                }
                placeholder="담당 업무를 입력하세요."
              />
            </FullWidthWrapper>
          </FormGroup>

          {/* 상세 내용 */}
          <FormGroup label="상세 내용">
            <QuillWrapper>
              <ReactQuill
                theme="snow"
                value={board.introduce}
                onChange={(value) => {
                  setBoard((prev) => ({ ...prev, introduce: value }));
                }}
                placeholder="상세 내용을 입력하세요."
              />
            </QuillWrapper>
          </FormGroup>

          {/* 세부 경력 */}
          경력
          <FormGroup label="세부 경력">
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  handleAdd(
                    {
                      company: "",
                      department: "",
                      startDate: "",
                      endDate: "",
                      position: "",
                      responsibility: "",
                      salary: "",
                    },
                    "experienceDetail"
                  )
                }
              >
                + 경력 추가
              </AddButtonLarger>
            </DevSection>

            {board.experienceDetail.map((detail, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={detail.company || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "company", e.target.value, "experienceDetail")
                    }
                    placeholder="회사명"
                  />
                  <Input
                    type="text"
                    value={detail.department || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "department", e.target.value, "experienceDetail")
                    }
                    placeholder="부서명"
                  />
                  <Input
                    type="text"
                    value={detail.startDate || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "startDate", e.target.value, "experienceDetail")
                    }
                    placeholder="입사일"
                  />
                  <Input
                    type="text"
                    value={detail.endDate || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "endDate", e.target.value, "experienceDetail")
                    }
                    placeholder="퇴사일"
                  />
                  <Input
                    type="text"
                    value={detail.position || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "position", e.target.value, "experienceDetail")
                    }
                    placeholder="직급"
                  />
                  <Input
                    type="text"
                    value={detail.responsibility || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "responsibility", e.target.value, "experienceDetail")
                    }
                    placeholder="담당 업무"
                  />
                  <Input
                    type="text"
                    value={detail.salary || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "salary", e.target.value, "experienceDetail")
                    }
                    placeholder="연봉"
                  />
                  <DeleteButton
                    type="button"
                    onClick={() => handleDelete(index, "experienceDetail")}
                  >
                    x
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 자격증 */}
          자격증
          <FormGroup label="자격증">
            {/* 자격증 추가 버튼 */}
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  handleAdd(
                    { certificationName: "", issueDate: "", issuer: "" },
                    "certifications"
                  )
                }
              >
                + 자격증 추가
              </AddButtonLarger>
            </DevSection>

            {/* 자격증 리스트 */}
            {board.certifications.map((certification, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={certification.certificationName || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "certificationName",
                        e.target.value,
                        "certifications"
                      )
                    }
                    placeholder="자격증명"
                  />
                  <Input
                    type="text"
                    value={certification.issueDate || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "issueDate", e.target.value, "certifications")
                    }
                    placeholder="발급일"
                  />
                  <Input
                    type="text"
                    value={certification.issuer || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "issuer", e.target.value, "certifications")
                    }
                    placeholder="발급기관"
                  />
                  <DeleteButton
                    type="button"
                    onClick={() => handleDelete(index, "certifications")}
                  >
                    x
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 언어 능력 */}
          언어
          <FormGroup label="언어 능력">
            <DevSection>
              <AddButtonLarger
                type="button"
                onClick={() =>
                  handleAdd({ language: "", level: "" }, "languageSkills")
                }
              >
                + 언어 능력 추가
              </AddButtonLarger>
            </DevSection>

            {board.languageSkills.map((languageSkill, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={languageSkill.language || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "language", e.target.value, "languageSkills")
                    }
                    placeholder="언어"
                  />
                  <Input
                    type="text"
                    value={languageSkill.level || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "level", e.target.value, "languageSkills")
                    }
                    placeholder="능력 수준 (예: 유창함, 비즈니스 회화, 일상 회화)"
                  />
                  <DeleteButton
                    type="button"
                    onClick={() => handleDelete(index, "languageSkills")}
                  >
                    x
                  </DeleteButton>
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 학력 */}
          학력
          <FormGroup label="학력">
            {board.education.map((edu, index) => (
              <DevWrapper key={index}>
                <div className="row">
                  <Input
                    type="text"
                    value={edu.school || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "school", e.target.value, "education")
                    }
                    placeholder="학교명"
                  />
                  <Input
                    type="text"
                    value={edu.major || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "major", e.target.value, "education")
                    }
                    placeholder="전공"
                  />
                  <Input
                    type="text"
                    value={edu.date || ""}
                    onChange={(e) =>
                      handleArrayChange(index, "date", e.target.value, "education")
                    }
                    placeholder="날짜"
                  />
                </div>
              </DevWrapper>
            ))}
          </FormGroup>

          {/* 링크 */}
          링크
          <FormGroup label="링크">
            <FullWidthWrapper>
              <Input
                type="text"
                value={board.link || ""}
                onChange={(e) =>
                  setBoard((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="깃허브 또는 포트폴리오 링크를 입력하세요."
              />
            </FullWidthWrapper>
          </FormGroup>

          {/* 경력 */}
          경력
          <FormGroup label="경력(년차)">
            <FullWidthWrapper>
              <Input
                type="number"
                value={board.workExperience || ""}
                onChange={(e) =>
                  setBoard((prev) => ({ ...prev, workExperience: e.target.value }))}
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
                value={board.skill || ""}
                onChange={(e) =>
                  setBoard((prev) => ({ ...prev, skill: e.target.value }))}
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
                value={board.jobCategory || ""}
                onChange={(e) =>
                  setBoard((prev) => ({ ...prev, jobCategory: e.target.value }))}
                placeholder="직무를 입력하세요 (백엔드 개발자...)"
              />
            </FullWidthWrapper>
          </FormGroup>

          <FormGroup label="이력서 파일">
            <FullWidthWrapper>
              {/* 이전 또는 수정된 파일 표시 */}
              {board.resumeFolder && (
                <p>
                  현재 등록된 파일:{" "}
                  <a href={board.resumeFolder} target="_blank" rel="noopener noreferrer">
                    {board.resumeFolderName || "다운로드"}
                  </a>
                </p>
              )}
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </FullWidthWrapper>
          </FormGroup>

          <Button type="submit">수정하기</Button>
        </Form>
      </Container>
    </>
  );
};

export default ResumeEdit;
