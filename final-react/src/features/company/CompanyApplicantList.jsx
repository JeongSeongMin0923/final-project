import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CompanyLayout from './CompanyLayout';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useApiHost } from '../../context/ApiHostContext';

const CompanyApplicantList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filter, setFilter] = useState('all');
  const { API_HOST } = useApiHost();

  const handleStatusChange = (applicantId, newStatus) => {
    let message;
    if (newStatus === '합격') {
      message = '해당 지원자를 합격 처리하시겠습니까?';
    } else if (newStatus === '불합격') {
      message = '해당 지원자를 불합격 처리하시겠습니까?';
    } else {
      message = '해당 지원자를 검토중으로 변경하시겠습니까?';
    }

    if (window.confirm(message)) {
      setApplicants(applicants.map(applicant =>
        applicant.id === applicantId
          ? { ...applicant, status: newStatus }
          : applicant
      ));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 없음';
    try {
      const date = parseISO(dateString); // ISO 8601 형식을 안전하게 파싱
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '날짜 오류';
    }
  };

  useEffect(() => {
    console.log('현재 applicants:', applicants); // 디버깅
  }, [applicants]);

  const filteredApplicants = filter === 'all'
    ? applicants
    : applicants.filter(applicant => applicant.status === filter);

  return (
    <CompanyLayout>
      <Container>
        <Header>
          <h1>지원자 목록</h1>
          <FilterGroup>
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>전체</FilterButton>
            <FilterButton active={filter === '검토중'} onClick={() => setFilter('검토중')}>검토중</FilterButton>
            <FilterButton active={filter === '합격'} onClick={() => setFilter('합격')}>합격</FilterButton>
            <FilterButton active={filter === '불합격'} onClick={() => setFilter('불합격')}>불합격</FilterButton>
          </FilterGroup>
        </Header>

        <ApplicantGrid>
          {filteredApplicants.map((applicant) => (
            <ApplicantCard key={applicant.id}>
              <ApplicantHeader>
                <div>
                  <h3>{applicant.name}</h3>
                  <p>{applicant.email}</p>
                  <p>{applicant.phone}</p>
                </div>
                <StatusBadge status={applicant.status}>{applicant.status}</StatusBadge>
              </ApplicantHeader>
              <ApplicantInfo>
                <p>지원일: {formatDate(applicant.submissionDate)}</p>
              </ApplicantInfo>
              <ButtonGroup>
                <ViewButton onClick={() => window.open(applicant.resumeUrl)}>
                  이력서 보기
                </ViewButton>
                <ActionButton
                  variant="pending"
                  onClick={() => handleStatusChange(applicant.id, '검토중')}
                  disabled={applicant.status === '검토중'}>
                  검토중
                </ActionButton>
                <ActionButton
                  variant="success"
                  onClick={() => handleStatusChange(applicant.id, '합격')}
                  disabled={applicant.status === '합격'}>
                  합격
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => handleStatusChange(applicant.id, '불합격')}
                  disabled={applicant.status === '불합격'}>
                  불합격
                </ActionButton>
              </ButtonGroup>
            </ApplicantCard>
          ))}
        </ApplicantGrid>
      </Container>
    </CompanyLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  cursor: pointer;
`;

const ApplicantGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ApplicantCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ApplicantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h3 {
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background: ${props => {
    switch (props.status) {
      case '합격': return '#dcfce7';
      case '불합격': return '#fee2e2';
      case '검토중': return '#f3f8ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case '합격': return '#166534';
      case '불합격': return '#991b1b';
      case '검토중': return '#1e40af';
      default: return '#4b5563';
    }
  }};
`;

const ApplicantInfo = styled.div`
  margin: 1rem 0;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  flex: 2;
  padding: 0.75rem;
  border: 1px solid #2563eb;
  color: #2563eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#dcfce7';
      case 'danger': return '#fee2e2';
      case 'pending': return '#f3f8ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success': return '#166534';
      case 'danger': return '#991b1b';
      case 'pending': return '#1e40af';
      default: return '#4b5563';
    }
  }};
`;

export default CompanyApplicantList;