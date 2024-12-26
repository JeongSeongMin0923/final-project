import { useState, useEffect } from 'react';
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

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);

  // 날짜를 "2024년 12월 17일" 형식으로 변환
  const dateFormat = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  // 시간을 "14시 01분" 형식으로 변환
  const timeFormat = new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24시간 형식
  }).format(date);

  return `${dateFormat} ${timeFormat}`;
}

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_HOST } = useApiHost();

  const handleDeleteClick = (applyCode) => {
    setSelectedApplicationId(applyCode);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_HOST}/apply/remove/${selectedApplicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.filter(app => app.applyCode !== selectedApplicationId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      alert('지원 취소에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_HOST}/apply/myApply`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API Response:', response.data); // 디버깅용
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('지원 내역을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  const handleWithdraw = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = () => {
    setApplications(applications.filter(app => app.id !== selectedApplicationId));
    setShowWithdrawModal(false);
  };

  const getFilteredApplications = () => {
    console.log('Current Status:', selectedStatus);
    console.log('All Applications:', applications);

    if (selectedStatus === '전체') {
      return applications;
    }

    // Fix: Use applyStatus instead of status
    return applications.filter(app => {
      console.log('Comparing:', {
        applicationStatus: app.applyStatus,
        selectedStatus: selectedStatus,
        matches: app.applyStatus === selectedStatus
      });
      return app.applyStatus === selectedStatus;
    });
  };


  return (
    <Container>
      <Header>
        <Title>지원 현황 관리</Title>
        <StatusFilter>
          {[
            { key: '전체', label: '전체' },
            { key: 'APPLIED', label: '지원완료' },
            { key: 'PASSED', label: '서류통과' },
            { key: 'INTERVIEW', label: '면접예정' },
            { key: 'ACCEPTED', label: '최종합격' },
            { key: 'REJECTED', label: '불합격' }
          ].map(({ key, label }) => (
            <FilterButton
              key={key}
              active={selectedStatus === key}
              onClick={() => setSelectedStatus(key)}
            >
              {label}
            </FilterButton>
          ))}
        </StatusFilter>
      </Header>


      <ApplicationGrid>
        {getFilteredApplications().map(application => (
          <ApplicationCard key={application.id}>
            <CompanyInfo>
              <CompanyLogo src={application.companyLogo} alt={application.companyName} />
              <div>
                <CompanyName>{application.companyName}</CompanyName>
                <JobTitle>{application.jobTitle}</JobTitle>
              </div>

            </CompanyInfo>

            <StatusSection>
              <StatusBadge status={application.applyStatus}>
                {STATUS_MAPPING[application.applyStatus] || application.applyStatus}
              </StatusBadge>
            </StatusSection>

            <Footer>
              <ApplyDate>
                {formatDateTime(application.submissionDate)}</ApplyDate>
              <ButtonGroup>
                <ViewButton onClick={() => window.location.href =
                  `/profile/applications/${application.applyCode}`}>상세보기
                </ViewButton>
                <DeleteButton onClick={() => handleDeleteClick(application.applyCode)}>
                  취소
                </DeleteButton>
              </ButtonGroup>
            </Footer>
          </ApplicationCard>
        ))}
      </ApplicationGrid>

      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <h3>지원 취소</h3>
            <p>정말로 지원을 취소하시겠습니까?</p>
            <ModalButtons>
              <ConfirmButton onClick={handleConfirmDelete}>확인</ConfirmButton>
              <CancelButton onClick={() => setShowDeleteModal(false)}>취소</CancelButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const StatusFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? '#3498db' : '#f0f2f5'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2980b9' : '#e2e8f0'};
  }
`;

const ApplicationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ApplicationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CompanyInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CompanyLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const CompanyName = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const JobTitle = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const StatusSection = styled.div`
  margin: 1rem 0;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'APPLIED':
        return 'background: #e3f2fd; color: #1565c0;';
      case 'PASSED':
        return 'background: #e8f5e9; color: #2e7d32;';
      case 'INTERVIEW':
        return 'background: #fff3e0; color: #ef6c00;';
      case 'ACCEPTED':
        return 'background: #e8f5e9; color: #2e7d32;';
      case 'REJECTED':
        return 'background: #ffebee; color: #c62828;';
      default:
        return 'background: #f5f5f5; color: #666666;';
    }
  }}
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const ApplyDate = styled.span`
  color: #95a5a6;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #3498db;
  border-radius: 6px;
  background: white;
  color: #3498db;
  cursor: pointer;
  
  &:hover {
    background: #f7f9fc;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  background: white;
  color: #e74c3c;
  cursor: pointer;
  
  &:hover {
    background: #fff5f5;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;

  h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  p {
    margin-bottom: 1.5rem;
    color: #34495e;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ConfirmButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #e74c3c;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #c0392b;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  background: white;
  color: #7f8c8d;
  cursor: pointer;
  
  &:hover {
    background: #f7f9fc;
  }
`;

export default ApplicationManagement;