import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useApiHost } from '../context/ApiHostContext';

const STATUS_MAPPING = {
  'APPLIED': '지원완료',
  'PASSED': '서류통과',
  'INTERVIEW': '면접예정',
  'ACCEPTED': '최종합격',
  'REJECTED': '불합격'
};

const ApplicationDetail = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_HOST}/apply/read/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplication(response.data);
        setLoading(false);
      } catch (err) {
        setError('지원 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) return <LoadingWrapper>로딩중...</LoadingWrapper>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!application) return <ErrorMessage>지원 정보를 찾을 수 없습니다.</ErrorMessage>;

  return (
    <Container>
      <Title>지원 상세 정보</Title>
      <DetailCard>
        <InfoRow>
          <Label>지원 번호</Label>
          <Value>{application.applyCode}</Value>
        </InfoRow>
        <InfoRow>
          <Label>회사명</Label>
          <Value>{application.companyName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>지원 상태</Label>
          <StatusBadge status={application.applyStatus}>
            {STATUS_MAPPING[application.applyStatus]}
          </StatusBadge>
        </InfoRow>
        <InfoRow>
          <Label>제출 이력서</Label>
          <Value>
            <ViewResumeButton onClick={() => navigate(`/resumes/${application.resumeCode}`)}>
              이력서 보기
            </ViewResumeButton>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>지원일</Label>
          <Value>
            {new Date(application.submissionDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Value>
        </InfoRow>
      </DetailCard>
      <Footer>
        <BackButton onClick={() => navigate('/profile/applications')}>
          지원 현황으로 돌아가기
        </BackButton>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  min-height: calc(100vh - 200px);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const Label = styled.span`
  width: 120px;
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'PASSED':
        return 'background: #e8f5e9; color: #2e7d32;';
      case 'REJECTED':
        return 'background: #ffebee; color: #c62828;';
      default:
        return 'background: #e3f2fd; color: #1565c0;';
    }
  }}
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #c62828;
  text-align: center;
  padding: 2rem;
`;

const ViewResumeButton = styled.button`
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #1565c0;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;
export default ApplicationDetail;