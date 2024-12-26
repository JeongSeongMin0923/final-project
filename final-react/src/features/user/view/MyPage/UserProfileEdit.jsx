import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../pages/AuthContent";
import Modal from "react-modal";
import { useApiHost } from '../../../../context/ApiHostContext';

Modal.setAppElement("#root"); // Modal 접근성을 위한 설정

const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

const UserProfileEdit = () => {
  const { userId, userCode, name, email, userType, readOnly, cancelAccount } = useAuth();
  const navigate = useNavigate();

  // userType에 따라 resolvedUserId 결정
  const resolvedUserId = userType === "kakao" || userType === "naver" ? userCode : userId;

  const [isSocialRemoveModalOpen, setIsSocialRemoveModalOpen] = useState(false); // 소셜 회원탈퇴 모달 상태
  const [errors, setErrors] = useState({});
  const [userInput, setUserInput] = useState(""); // 사용자 입력
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태
  const [serverError, setServerError] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const { API_HOST } = useApiHost();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleOpenSocialRemoveModal = () => setIsSocialRemoveModalOpen(true);
  const handleCloseSocialRemoveModal = () => {
    setIsChecked(false);
    setUserInput("");
    setError("");
    setIsSocialRemoveModalOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (!passwordPattern.test(formData.newPassword)) {
      newErrors.newPassword = "비밀번호는 영문과 숫자를 포함하여 8~13자로 설정해주세요.";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "새 비밀번호가 서로 일치하지 않습니다.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인 상태가 유효하지 않습니다. 다시 로그인해주세요.");
          navigate("/auth/sign-in");
          return;
        }

        const response = await fetch(`${API_HOST}/api/v1/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "No permission") {
            setServerError("비밀번호가 일치하지 않습니다.");
          } else {
            setServerError(errorData.message || "비밀번호 변경 중 문제가 발생했습니다.");
          }
          throw new Error(errorData.message || "비밀번호 변경 중 문제가 발생했습니다.");
        }

        alert("비밀번호가 정상적으로 변경되었습니다. \n다시 로그인해주세요.");
        navigate("/auth/sign-in"); // 로그인 페이지로 이동
        cancelAccount();
      } catch (error) {
        console.error("비밀번호 변경 중 오류:", error.message);
        alert("현재 비밀번호가 일치하지 않습니다.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
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

      if (!resolvedUserId) {
        alert("회원 정보를 가져오지 못했습니다. 다시 로그인해주세요.");
        navigate("/auth/sign-in");
        return;
      }

      const response = await fetch(`${API_HOST}/api/v1/social-remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userCode: resolvedUserId, // 소셜 회원은 userCode로 탈퇴 처리
        }),
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

  return (
    <>
      <Title>회원정보 확인</Title>
      <Container>
        <MainContent>
          <Form onSubmit={handleSubmit}>
            {/* 프로필 섹션 */}
            {activeSection === "profile" && (
              <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <FormGroup>
                  <Label>아이디</Label>
                  <Input type="text" value={resolvedUserId} readOnly={readOnly} />
                </FormGroup>
                <FormGroup>
                  <Label>이름</Label>
                  <Input type="text" value={name} readOnly={readOnly} />
                </FormGroup>
                <FormGroup>
                  <Label>이메일</Label>
                  <Input type="email" value={email} readOnly={readOnly} />
                </FormGroup>
              </Section>
            )}

            {/* 비밀번호 변경 섹션 */}
            {activeSection === "password" && (
              <Section>
                <SectionTitle>비밀번호 변경</SectionTitle>
                <FormGroup>
                  <Label>현재 비밀번호</Label>
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                  {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>새 비밀번호</Label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                  {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label>새 비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                  />
                  {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                </FormGroup>
              </Section>
            )}

            {activeSection === "password" && (
              <ButtonGroup>
                <SaveButton type="submit" disabled={loading}>
                  {loading ? "저장 중..." : "저장하기"}
                </SaveButton>
                <CancelButton type="button" onClick={() => navigate("/mypage")}>
                  취소
                </CancelButton>
              </ButtonGroup>
            )}
          </Form>
        </MainContent>

        <Sidebar>
          <NavMenu>
            <NavItem
              active={activeSection === 'profile'}
              onClick={() => setActiveSection('profile')}
            >
              기본 정보
            </NavItem>
            {['dev', 'company'].includes(userType) && (
              <NavItem
                active={activeSection === 'password'}
                onClick={() => setActiveSection('password')}
              >
                비밀번호 변경
              </NavItem>
            )}
            <DeleteButton onClick={handleOpenSocialRemoveModal}>회원 탈퇴</DeleteButton>
          </NavMenu>
        </Sidebar>

        {/* 회원탈퇴 확인 모달 */}
        <Modal
          isOpen={isSocialRemoveModalOpen}
          onRequestClose={handleCloseSocialRemoveModal}
          contentLabel="소셜 회원탈퇴"
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            content: {
              width: "520px", // 기존 크기보다 약 30% 증가
              height: "fit-content",
              maxHeight: "90vh",
              margin: "auto",
              padding: "30px", // 더 넓은 여백
              borderRadius: "12px",
              overflowY: "auto",
            },
          }}
        >
          <ModalContent>
            <h2>회원 탈퇴</h2>
            <form onSubmit={handleRemoveSubmit}>
              <div>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    id="socialConsent"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <Labels htmlFor="socialConsent">
                    회원 탈퇴를 진행하여 통합 로그인 계정에 <br /> 귀속된 모든 정보를 삭제하는데 동의합니다.
                  </Labels>
                </CheckboxContainer>
                <Labels>
                  {resolvedUserId}/탈퇴합니다 를 입력하세요
                </Labels>
                <InputContainer>
                  <PasswordInput
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={`${resolvedUserId}/탈퇴합니다 를 입력하세요`} // 변경
                    required
                  />
                </InputContainer>
                {userInput && userInput !== `${resolvedUserId}/탈퇴합니다` && (
                  <ErrorMessage>입력하신 내용이 정확하지 않습니다.</ErrorMessage>
                )}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <ButtonGroup>
                  <SubmitButton
                    type="submit"
                    disabled={!isChecked || userInput !== `${resolvedUserId}/탈퇴합니다`}
                  >
                    회원 탈퇴
                  </SubmitButton>
                  <CancelButton type="button" onClick={handleCloseSocialRemoveModal}>
                    취소
                  </CancelButton>
                </ButtonGroup>
              </div>
            </form>
          </ModalContent>
        </Modal>

      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 1.5rem;
  display: flex;
  gap: 2rem;
`;

const MainContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  color: #1a365d;
  margin-bottom: 2.5rem;
  text-align: center;
  font-weight: 700;
`;

const Sidebar = styled.div`
  width: 250px;
  height: fit-content;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.button`
  padding: 1rem 1.5rem;
  text-align: left;
  background: ${props => props.active ? '#3182ce' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#2b6cb0' : '#f7fafc'};
  }
`;

const NavRemoveItem = styled.button`
  padding: 1rem 1.5rem;
  text-align: left;
  background: ${props => props.active ? '#3182ce' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fc0f03;
    color : #ffffff;
    transition: 1s;
  }
`;

const Form = styled.form`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 95%;
  padding: 1rem;
  border: 2px solid ${(props) => (props.hasError ? "#e74c3c" : "#e9ecef")};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? "#e74c3c" : "#3498db")};
    box-shadow: 0 0 0 3px ${(props) => (props.hasError ? "rgba(231, 76, 60, 0.1)" : "rgba(52, 152, 219, 0.1)")};
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;
const Button = styled.button`
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SaveButton = styled(Button)`
  background: #3498db;
  color: white;
  border: none;

  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(Button)`
  padding: 10px 15px;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #e2e6ea;
  }
`;

const DeleteButton = styled(Button)`
  background: white;
  color: #e53e3e;
  border: 2px solid #e53e3e;

&:hover {
  background: #fff5f5;
  border-color: #fc8181;
}
`;

const ModalContent = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0;
`;

const InputContainer = styled.div`
  margin: 20px 0;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.2);
  }
`;
const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Labels = styled.label`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
`;

export default UserProfileEdit;
