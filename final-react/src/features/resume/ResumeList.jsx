import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useApiHost } from '../../context/ApiHostContext';

const formatLocalDateTime = (localDateTime) => {
  if (!localDateTime) return "없음";
  const date = new Date(localDateTime);
  return format(date, 'yyyy-mm-dd'); // date-fns의 format 함수 사용
};

// 컴포넌트 시작
const ResumeList = () => {
  // 초기값 설정
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_HOST } = useApiHost();

  const token = localStorage.getItem('token');
  const userCode = localStorage.getItem('userCode');

  // useEffect 함수를 써서 페이지가 생성될때 API를 한번만 호출

  useEffect(() => {
    const apicall = async () => {
      // Postman 보고 API 주소 수정
      const response = await axios.get(`${API_HOST}/resume/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userCode
        },
      });
      if (response.status === 200) {
        console.log("API Response Data:", response.data); // 데이터 구조 확인

        const sortedResumes = [...response.data].reverse();
        setResumes(sortedResumes);
      } else {
        throw new Error(`api error: ${response.status} ${response.statusText}`);
      }

    }
    apicall();
  }, [token, userCode]);

  // 삭제 핸들러
  const handleDelete = async (resumeCode) => {
    if (!window.confirm('이력서를 삭제하시겠습니까?')) return;

    try {
      const response = await axios.delete(`${API_HOST}/resume/remove/${resumeCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) { // 204 상태 처리
        console.log(`Deleted successfully, resumeCode: ${resumeCode}`);

        // 상태 업데이트
        setResumes((prevResumes) => {
          const updatedResumes = prevResumes.filter((resume) => resume.resumeCode !== resumeCode);
          console.log("Updated resumes:", updatedResumes);
          return updatedResumes;
        });
      } else {
        console.warn("Unexpected response:", response.status);
      }
    } catch (error) {
      console.error("이력서 삭제 실패:", error);
    }
  };

  // 상태 변화 확인
  useEffect(() => {
    console.log("Resumes state updated:", resumes);
  }, [resumes]);

  return (
    <Container>
      <Header>
        <Title>내 이력서 관리</Title>
        <CreateButton to="/resumes/post">새 이력서 작성</CreateButton>
      </Header>

      <ResumeGrid>
        {resumes.map(resume => (
          <ResumeCard key={resume.resumeCode}>
            <ResumeInfo>
              <ResumeTitle>{resume.work}</ResumeTitle>
              <MetaInfo>
                <UpdateDate>마지막 수정: {resume.updateDate && !isNaN(new Date(resume.updateDate))
                  ? format(new Date(resume.updateDate), 'yyyy-MM-dd')
                  : " "}</UpdateDate>
              </MetaInfo>
            </ResumeInfo>
            <ButtonGroup>
              <ActionButton as={Link} to={`/resumes/modify/${resume.resumeCode}`} className="edit">
                수정
              </ActionButton>
              <ActionButton as={Link} to={`/resumes/${resume.resumeCode}`} className="preview">
                상세
              </ActionButton>
              <ActionButton onClick={() => handleDelete(resume.resumeCode)} className="delete">
                삭제
              </ActionButton>
            </ButtonGroup>
          </ResumeCard>
        ))}
      </ResumeGrid>
    </Container>
  );
};


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
`;

const CreateButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background: #3182ce;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #2c5282;
  }
`;

const ResumeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ResumeCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ResumeInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const ResumeTitle = styled.h3`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UpdateDate = styled.span`
  color: #718096;
  font-size: 0.875rem;
`;

const Status = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background: ${props => props.isPublic ? '#e6fffa' : '#edf2f7'};
  color: ${props => props.isPublic ? '#047857' : '#4a5568'};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center; // 텍스트 중앙 정렬 추가
  text-decoration: none; // Link 컴포넌트 스타일링을 위해
  display: flex; // flexbox로 정렬
  justify-content: center; // 가로 중앙 정렬
  align-items: center; // 세로 중앙 정렬

  &.edit {
    border-color: #3182ce;
    color: #3182ce;
    background: white;

    &:hover {
      background: #ebf8ff;
    }
  }

  &.preview {
    border-color: #48bb78;
    color: #48bb78;
    background: white;

    &:hover {
      background: #f0fff4;
    }
  }

  &.delete {
    border-color: #e53e3e;
    color: #e53e3e;
    background: white;

    &:hover {
      background: #fff5f5;
    }
  }
`;

export default ResumeList;