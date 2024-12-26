import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useApiHost } from '../../context/ApiHostContext';

const JobResumeSubmit = () => {
  const { code } = useParams(); // URL의 code 파라미터 받기
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { API_HOST } = useApiHost();

  const userCode = localStorage.getItem('userCode');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_HOST}/resume/list`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { userCode }
        });
        console.log('Fetched resumes:', response.data); // 데이터 확인
        setResumes(response.data);
      } catch (err) {
        setError('이력서 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_HOST}/apply/applyto/${code}?resumeCode=${selectedResume}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setIsSuccess(true);
      setModalMessage('지원이 완료되었습니다.');
      setShowModal(true);
    } catch (err) {
      console.error('API Error:', err);
      setIsSuccess(false);
      setModalMessage('지원에 실패했습니다.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (!selectedResume) {
      alert('이력서를 선택해주세요.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_HOST}/apply/applyto/${code}?resumeCode=${selectedResume}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setIsSuccess(true);
      setModalMessage('지원이 완료되었습니다.');
      setShowModal(true);
    } catch (err) {
      console.error('API Error:', err);
      setIsSuccess(false);

      if (err.response && err.response.status === 409) {
        setModalMessage('동일 공고에 중복 지원이 불가능합니다.');
      } else {
        setModalMessage('지원에 실패했습니다.');
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isSuccess) {
      navigate(`/jobs/${code}`);
    } else {
      navigate('/jobs');
    }
  };

  if (loading) return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;

  return (
    <Container>
      <Title>이력서 선택</Title>
      <ResumeList>
        {resumes.map(resume => (
          <ResumeItem
            key={resume.resumeCode}
            selected={selectedResume === resume.resumeCode}
          >
            <ResumeContent onClick={() => setSelectedResume(resume.resumeCode)}>
              <ResumeTitle>{resume.introduce}</ResumeTitle>
              <ResumeDate>
                작성일: {new Date(resume.createDate).toLocaleDateString()}
              </ResumeDate>
            </ResumeContent>
            <ViewButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/resumes/${resume.resumeCode}`);
              }}
            >
              이력서 보기
            </ViewButton>
          </ResumeItem>
        ))}
      </ResumeList>
      <ButtonGroup>
        <SubmitButton onClick={handleSubmitClick} disabled={!selectedResume || loading}>
          지원하기
        </SubmitButton>
      </ButtonGroup>

      {showConfirmModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>지원 확인</ModalTitle>
            <ModalMessage>정말로 지원하시겠습니까?</ModalMessage>
            <ModalButtonGroup>
              <ConfirmButton onClick={handleConfirmSubmit}>확인</ConfirmButton>
              <CancelButton onClick={() => setShowConfirmModal(false)}>취소</CancelButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>{isSuccess ? '지원 완료' : '지원 실패'}</ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButton onClick={handleModalClose}>
              확인
            </ModalButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const ResumeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResumeItem = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#3498db' : '#e9ecef'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #3498db;
    background: ${props => props.selected ? '#f8f9fa' : '#fff'};
  }
`;


const ResumeTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ResumeContent = styled.div`
  flex: 1;
`;

const ResumeDate = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background: #3498db;
  color: white;
  border: none;
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ErrorWrapper = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  border: 1px solid #3498db;
  border-radius: 4px;
  background: white;
  color: #3498db;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3498db;
    color: white;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.isSuccess ? '#2e7d32' : '#c62828'};
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ConfirmButton = styled.button`
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #d5d5d5;
  }
`;

export default JobResumeSubmit;