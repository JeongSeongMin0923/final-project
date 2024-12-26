import { useState, useEffect } from "react";
import styled from "styled-components";
import CompanyLayout from "./CompanyLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApiHost } from '../../context/ApiHostContext';

const CompanyProfileManage = () => {
  const navigate = useNavigate();

  // formData의 초기값을 DTO에 맞게 설정
  const [formData, setFormData] = useState({
    companyProfileCode: null, // 기업 프로필 코드
    companyName: "", // 회사 이름
    companyType: "", // 기업 형태
    ceoName: "", // 대표 이름
    companyAddress: "", // 회사 주소
    companyDescription: "", // 회사 설명
    industry: "", // 업종
    websiteUrl: "", // 웹사이트
  });

  const [isEditMode, setIsEditMode] = useState(false); // 수정/저장 모드 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const { API_HOST } = useApiHost();

  // 초기 데이터 로드
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("로그인이 필요합니다.");
        setIsLoading(true);

        // 현재 회사 프로필 코드 가져오기
        const profileCodeResponse = await axios.get(
          `${API_HOST}/companyprofile/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const companyProfileCode = profileCodeResponse.data;

        // 회사 프로필 데이터 가져오기
        const response = await axios.get(
          `${API_HOST}/companyprofile/read/${companyProfileCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          companyProfileCode, // 회사 프로필 코드 설정
          companyName: response.data.companyName || "",
          companyType: response.data.companyType || "",
          ceoName: response.data.ceoName || "",
          companyAddress: response.data.companyAddress || "",
          companyDescription: response.data.companyDescription || "",
          industry: response.data.industry || "",
          websiteUrl: response.data.websiteUrl || "",
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 버튼 핸들러
  const handleEditClick = () => setIsEditMode(true);

  // 저장 버튼 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      console.log("수정 요청 데이터:", formData);

      const response = await axios.put(
        `${API_HOST}/companyprofile/modify`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        alert("정보가 성공적으로 저장되었습니다.");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <CompanyLayout>
      <Container>
        <Title>기업 정보 관리</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>기본 정보</SectionTitle>

            <FormGroup>
              <Label>회사명</Label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>기업형태</Label>
              <Input
                type="text"
                name="companyType"
                value={formData.companyType}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>대표명</Label>
              <Input
                type="text"
                name="ceoName"
                value={formData.ceoName}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>주소</Label>
              <Input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>회사 설명</Label>
              <TextArea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>업종</Label>
              <Input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>

            <FormGroup>
              <Label>웹사이트</Label>
              <Input
                type="text"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                readOnly={!isEditMode}
              />
            </FormGroup>
          </Section>

          <ButtonGroup>
            {isEditMode ? (
              <SaveButton type="submit">저장하기</SaveButton>
            ) : (
              <EditButton type="button" onClick={handleEditClick}>
                수정하기
              </EditButton>
            )}
            <CancelButton type="button" onClick={() => navigate("/company/profile")}>
              취소
            </CancelButton>
          </ButtonGroup>
        </Form>
      </Container>
    </CompanyLayout>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a365d;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LogoPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
`;

const LogoUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadButton = styled.label`
  padding: 0.75rem 1.5rem;
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #cbd5e0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  padding: 0.75rem 2rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2c5282;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f7fafc;
  }
`;

const EditButton = styled.button`
  background: #48bb78;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #2f855a;
  }
`;

export default CompanyProfileManage;