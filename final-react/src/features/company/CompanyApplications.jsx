import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // axios 추가
import CompanyLayout from './CompanyLayout';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useApiHost } from '../../context/ApiHostContext';

const CompanyApplications = () => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [applications, setApplications] = useState([]); // API로 가져온 데이터
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { API_HOST } = useApiHost();

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

  // 백엔드 API로부터 지원자 데이터 가져오기
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_HOST}/apply/jobPoster/applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 예시 토큰 사용
          },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  // 지원 상태 변경 핸들러
  const handleStatusChange = async (applyCode, newStatus) => {
    try {
      await axios.
        put(
          `${API_HOST}/apply/${applyCode}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

      // 상태 변경 후 화면 상태 업데이트
      const updatedApplications = applications.map((app) =>
        app.applyCode === applyCode ? { ...app, applyStatus: newStatus } : app
      );
      setApplications(updatedApplications);

      alert('상태가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };


  // 선택된 공고에 따라 지원자 목록 필터링
  const filteredApplications =
    selectedJob === 'all'
      ? applications
      : applications.filter((app) => app.title === selectedJob);

  return (
    <CompanyLayout>
      <Container>
        <Header>
          <Title>지원자 관리</Title>
          <JobFilter>
            <Select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="all">전체 공고</option>
              {/* 공고 제목 중복 제거 */}
              {[...new Set(applications.map((app) => app.title))].map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Select>
          </JobFilter>
        </Header>

        <Table>
          <thead>
            <tr>
              <Th>지원자</Th>
              <Th>이메일</Th>
              <Th>지원공고</Th>
              <Th>경력</Th>
              <Th>지원일</Th>
              <Th>상태</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <Tr key={app.applyCode}>
                  <Td>{app.name}</Td>
                  <Td>{app.email}</Td>
                  <Td>{app.title}</Td>
                  <Td>{app.workExperience}</Td>
                  <Td>{formatDate(app.submissionDate)}</Td>
                  <Td>
                    <StatusBadge status={app.applyStatus}>
                      {app.applyStatus === 'APPLIED' && '서류심사'}
                      {app.applyStatus === 'PASSED' && '서류통과'}
                      {app.applyStatus === 'INTERVIEW' && '면접'}
                      {app.applyStatus === 'ACCEPTED' && '최종합격'}
                      {app.applyStatus === 'REJECTED' && '불합격'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <ButtonGroup>
                      <ActionButton onClick={() => window.location.href = `/resumes/${app.resumeCode}`}>
                        이력서
                      </ActionButton>
                      <StatusSelect
                        value={app.applyStatus}
                        onChange={(e) =>
                          handleStatusChange(app.applyCode, e.target.value)
                        }
                      >
                        <option value="APPLIED">서류심사</option>
                        <option value="PASSED">서류통과</option>
                        <option value="INTERVIEW">면접</option>
                        <option value="ACCEPTED">최종합격</option>
                        <option value="REJECTED">불합격</option>
                      </StatusSelect>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="7" style={{ textAlign: 'center' }}>
                  지원자 데이터가 없습니다.
                </Td>
              </Tr>
            )}
          </tbody>
        </Table>
      </Container>
    </CompanyLayout>
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
  color: #1a365d;
`;

const JobFilter = styled.div`
  width: 300px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  color: #1a365d;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'APPLIED':
        return 'background: #e3f2fd; color: #1565c0;'; // 파란색 계열 (서류심사)
      case 'PASSED':
        return 'background: #e8f5e9; color: #2e7d32;'; // 초록색 계열 (서류통과)
      case 'INTERVIEW':
        return 'background: #fff3e0; color: #ef6c00;'; // 주황색 계열 (면접)
      case 'ACCEPTED':
        return 'background: #e8f5e9; color: #2e7d32;'; // 초록색 계열 (최종합격)
      case 'REJECTED':
        return 'background: #ffebee; color: #c62828;'; // 빨간색 계열 (불합격)
      default:
        return 'background: #f5f5f5; color: #666666;';
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #1a365d;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #1a365d;
`;

export default CompanyApplications;