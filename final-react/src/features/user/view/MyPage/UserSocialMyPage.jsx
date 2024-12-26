import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../pages/AuthContent';
import Modal from 'react-modal';
import axios from 'axios';
import { useApiHost } from '../../../../context/ApiHostContext';

Modal.setAppElement('#root'); // Modal 접근성을 위한 설정

const UserSocialMyPage = () => {
  const {
    name,
    userType,
    email,
    userCode,
    userId,
    companyCode,
    companyType,
    companyName,
    ceoName,
    companyAddress,
    cancelAccount,
  } = useAuth(); // 변경된 AuthContext에서 각 필드를 가져옴

  const { API_HOST } = useApiHost();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 비밀번호 확인 모달 상태
  const [isSocialRemoveModalOpen, setIsSocialRemoveModalOpen] = useState(false); // 소셜 회원탈퇴 모달 상태
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태
  const [userInput, setUserInput] = useState(""); // 사용자 입력
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('MyPage 상태 확인:', {
      name,
      userType,
      email,
      userId,
      companyCode,
      companyType,
      companyName,
      ceoName,
      companyAddress,
    });
  }, [
    name,
    userType,
    email,
    userId,
    companyCode,
    companyType,
    companyName,
    ceoName,
    companyAddress,
  ]);

  const getUserTypeDisplay = (userType) => {
    switch (userType) {
      case 'dev':
        return '일반회원';
      case 'kakao':
      case 'naver':
        return '소셜회원';
      case 'company':
        return '기업회원';
      default:
        return '알 수 없음';
    }
  };

  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => {
    setPassword("");
    setError("");
    setIsPasswordModalOpen(false);
  };

  const handleOpenSocialRemoveModal = () => setIsSocialRemoveModalOpen(true);
  const handleCloseSocialRemoveModal = () => {
    setIsChecked(false);
    setUserInput("");
    setError("");
    setIsSocialRemoveModalOpen(false);
  };

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("토큰값:", token);

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/auth/sign-in");
        return;
      }

      const response = await fetch(`${API_HOST}/api/v1/check-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.result === "success") {
        alert("비밀번호 확인 완료");
        navigate("/profile/edit");
      } else {
        setError(data.message || "비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류:", error);
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/auth/sign-in");
        return;
      }

      const endpoint = userType === "kakao" || userType === "naver" || userType === "company" || userType === "dev"
        `${API_HOST}/api/v1/social-remove` // 소셜 회원 탈퇴

      const requestBody = JSON.stringify({
        userId,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        cancelAccount();
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        setError(data.message || "회원 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 중 오류 발생:", err);
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const [stats, setStats] = useState({
    totalApplications: 12,
    ongoingApplications: 5,
    savedJobs: 8,
    resumes: 0, // 초기값 설정
  });

  useEffect(() => {
    const userCode = localStorage.getItem("userCode");
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기

    if (userCode && token) {
      axios
        .get(`${API_HOST}/resume/count`, {
          params: { userCode },
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          },
        })
        .then((response) => {
          setStats((prevStats) => ({
            ...prevStats,
            resumes: response.data, // API 응답으로 이력서 개수 업데이트
          }));
        })
        .catch((error) => {
          console.error("Error fetching resume count:", error);
        });
    } else {
      console.error("Missing userCode or token in localStorage");
    }
  }, []);

  return (
    <Container>
      <Title>마이페이지</Title>

      <Grid>
        <Section>
          <SectionTitle>개인정보</SectionTitle>

          <ProfileCard>
            <ProfileInfo>
              <Name>이름: {name}</Name>
              <Type>회원유형: {getUserTypeDisplay(userType)}</Type>
              <Id>아이디: {userCode}</Id>
              <Email>이메일: {email}</Email>
            </ProfileInfo>
          </ProfileCard>

          {['dev', 'company'].includes(userType) && (
            <EditButton onClick={handleOpenPasswordModal}>회원 수정</EditButton>
          )}

          {['kakao', 'naver'].includes(userType) && (
            <EditButton onClick={() => navigate('/profile/edit')}>회원 수정</EditButton>
          )}


        </Section>

        {userType === "company" && (
          <Section>
            <SectionTitle>기업정보</SectionTitle>
            <ProfileCard>
              <ProfileInfo>
                <CompanyInfo>회사명: {companyName || "정보 없음"}</CompanyInfo>
                <CompanyInfo>업종: {companyType || "정보 없음"}</CompanyInfo>
                <CompanyInfo>대표자명: {ceoName || "정보 없음"}</CompanyInfo>
                <CompanyInfo>주소: {companyAddress || "정보 없음"}</CompanyInfo>
              </ProfileInfo>
            </ProfileCard>
          </Section>
        )}

        <Section>
          <SectionTitle>지원 현황</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.totalApplications}</StatNumber>
              <StatLabel>전체 지원</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.ongoingApplications}</StatNumber>
              <StatLabel>진행중</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.savedJobs}</StatNumber>
              <StatLabel>관심공고</StatLabel>
            </StatCard>
          </StatsGrid>
          <ViewMoreButton as={Link} to="/profile/applications">
            지원 현황 보기
          </ViewMoreButton>
        </Section>

        {userType !== "company" && (
          <Section>
            <SectionTitle>이력서 관리</SectionTitle>
            <ResumeSection>
              <ResumeCount>총 {stats.resumes}개의 이력서</ResumeCount>
              <ResumeButton as={Link} to="/resumes/post">새 이력서 등록</ResumeButton>
              <ResumeButton as={Link} to="/resumes/list">이력서 관리</ResumeButton>
            </ResumeSection>
          </Section>
        )}
      </Grid>


      {/* 비밀번호 확인 모달 */}
      <Modal
        isOpen={isPasswordModalOpen}
        onRequestClose={handleClosePasswordModal}
        contentLabel="비밀번호 확인"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "400px",
            height: "fit-content",
            maxHeight: "300px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            overflow: "hidden",
          },
        }}
      >
        <ModalContent>
          <h2>비밀번호 확인</h2>
          <form onSubmit={handlePasswordSubmit}>
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoFocus
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonGroup>
              <SubmitButton type="submit">확인</SubmitButton>
              <CancelButton type="button" onClick={handleClosePasswordModal}>
                취소
              </CancelButton>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

// 스타일 정의 부분
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row; /* 가로 배치 */
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: space-between; /* 텍스트와 체크박스 사이 공간 분배 */
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Label = styled.label`
  flex: 1; /* 가능한 한 많은 공간 차지 */
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  text-align: left; /* 텍스트 왼쪽 정렬 */
  padding-right: 10px; /* 체크박스와의 간격 */
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const ProfileCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Name = styled.span`
  color: #000000;
`;

const Id = styled.span`
  color: #000000;
`;

const Email = styled.span`
  color: #000000;
`;

const Type = styled.span`
  color: #000000;
`;

const CompanyInfo = styled.span`
  color: #000000;
`;

const EditButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #3498db;
  border-radius: 6px;
  background: white;
  color: #3498db; 
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: #f7f9fc;
  }
`;

const RemoveButton = styled.button`
  margin: 10px 0 0 10px;
  padding: 10px;
  border: 1px solid #3498db;
  border-radius: 6px;
  background: white;
  color: #3498db;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #e35946;
    color: #000000;
  }
`;

const RemoveSocialButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #3498db;
  border-radius: 6px;
  background: white;
  color: #3498db;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #e35946;
    color: #000000;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const ViewMoreButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: #2980b9;
  }
`;

const ResumeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResumeCount = styled.div`
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const ResumeButton = styled.button`
  padding: 0.75rem;
  border: 1px solid #3498db;
  border-radius: 6px;
  background: white;
  color: #3498db;
  cursor: pointer;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: #f7f9fc;
  }
`;

const ModalContent = styled.div`
  text-align: center;
`;

const PasswordInput = styled.input`
  width: 95%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: #2980b9;
  }
`;

const CancelButton = styled.button`
  background: #ccc;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #aaa;
  }
`;

export default UserSocialMyPage;