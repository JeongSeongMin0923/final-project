import { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { useApiHost } from '../../context/ApiHostContext';

const AdminJobs = () => {
  const ITEMS_PER_PAGE = 10;
  const token = localStorage.getItem('token');
  const { API_HOST } = useApiHost();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const STATUS_MAPPING = {
    true: '활성',
    false: '마감',
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_HOST}/jobposting/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Jobs data:', response.data);
        setJobPostings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs data');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleDeletePosting = async (id, title) => {
    if (window.confirm(`'${title}' 공고를 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`${API_HOST}/jobposting/remove/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobPostings(jobPostings.filter(job => job.jobCode !== id));
      } catch (err) {
        console.error('Failed to delete job posting:', err);
        alert('공고 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleView = (id) => {
    window.location.href = `/jobs/${id}`;
  };

  const filteredJobs = jobPostings.filter(job => {
    if (selectedStatus === 'all') return true;
    return job.postingStatus === (selectedStatus === 'active');
  });

  const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>채용공고 관리</Title>
          <FilterGroup>
            <FilterButton
              active={selectedStatus === 'all'}
              onClick={() => setSelectedStatus('all')}
            >
              전체
            </FilterButton>
            <FilterButton
              active={selectedStatus === 'active'}
              onClick={() => setSelectedStatus('active')}
            >
              활성
            </FilterButton>
            <FilterButton
              active={selectedStatus === 'closed'}
              onClick={() => setSelectedStatus('closed')}
            >
              마감
            </FilterButton>
          </FilterGroup>
        </Header>
        <Table>
          <thead>
            <tr>
              <Th>제목</Th>
              <Th>기업명</Th>
              <Th>상태</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map(job => (
              <Tr key={job.id}>
                <Td>{job.title}</Td>
                <Td>{job.profile.companyName}</Td>
                <Td>
                  <Status status={job.postingStatus}>
                    {STATUS_MAPPING[job.postingStatus]}
                  </Status>
                </Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleView(job.jobCode)}>조회</ActionButton>
                    <ActionButton danger onClick={() => handleDeletePosting(job.jobCode, job.title)}>
                      삭제
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          {[...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
        </Pagination>
      </Container>
    </AdminLayout>
  );
};

const Container = styled.div`
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      `;

const Table = styled.table`
width: 100%;
border-collapse: collapse;
margin-bottom: 1rem;
`;

const Th = styled.th`
padding: 1rem;
text-align: left;
border-bottom: 2px solid #e2e8f0;
color: #2d3748;
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

const Title = styled.h2`
      font-size: 1.5rem;
      color: #2d3748;
      margin-bottom: 1.5rem;
      `;

const Status = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    if (props.status) {
      return 'background: #e8f5e9; color: #2e7d32;'; // 활성 - 초록색
    } else {
      return 'background: #ffebee; color: #c62828;'; // 마감 - 빨간색
    }
  }}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.active ? '#1976d2' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.active ? '#1565c0' : '#e0e0e0'};
  }
`;

const ButtonGroup = styled.div`
      display: flex;
      gap: 0.5rem;
      `;

const ActionButton = styled.button`
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      ${props => props.danger
    ? `
      background-color: #fee2e2;
      color: #dc2626;
      &:hover { background-color: #fecaca; }
    `
    : `
      background-color: #e2e8f0;
      color: #475569;
      &:hover { background-color: #cbd5e1; }
    `
  }
      `;

const Pagination = styled.div`
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
      `;

const PageButton = styled.button`
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      background: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
      color: ${props => props.active ? 'white' : '#475569'};
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: ${props => props.active ? '#2563eb' : '#cbd5e1'};
  }
      `;

export default AdminJobs;