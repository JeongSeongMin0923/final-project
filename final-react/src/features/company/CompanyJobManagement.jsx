import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CompanyLayout from "./CompanyLayout";
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useApiHost } from '../../context/ApiHostContext';

const ITEMS_PER_PAGE = 9;

const CompanyJobManagement = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => {
    // 필터링 로직 추가
    const updatedJobs = jobs.filter(job => {
      if (filter === 'all') return true;
      if (filter === '진행중') return job.postingStatus === true;
      if (filter === '마감') return job.postingStatus === false;
      return true;
    });

    setFilteredJobs(updatedJobs);
  }, [filter, jobs]);

  const fetchJob = async () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    const userCode = localStorage.getItem('userCode');
    try {
      setLoading(true);
      setError(null);



      // Authorization 헤더 추가
      const response = await axios.get(`${API_HOST}/companyprofile/by-company`, {
        headers: {
          Authorization: `Bearer ${token}` // Bearer 토큰 추가
        },
        params: {
          userCode: userCode // Query Parameter 추가
        }
      });

      if (!response.data) throw new Error('데이터가 없습니다.');

      // 데이터 역순 정렬
      const reversedData = [...response.data].reverse();

      const sortedJobs = reversedData.sort((a, b) => {
        const today = new Date();

        const aDeadline = new Date(a.postingDeadline);
        const bDeadline = new Date(b.postingDeadline);

        const aIsExpired = aDeadline <= today; // 마감된 항목인지 여부
        const bIsExpired = bDeadline <= today;

        if (aIsExpired === bIsExpired) {
          return aDeadline - bDeadline; // 마감일 기준 오름차순 정렬
        }

        return aIsExpired ? 1 : -1; // 마감된 항목을 마지막으로 배치
      });

      const jobsWithImage = reversedData.map(job => ({
        ...job,
        imageUrl: job.imagePath,
      }));

      setJobs(jobsWithImage);
      setFilteredJobs(jobsWithImage);
    } catch (err) {
      setError(err.message || '채용공고를 불러오는데 실패했습니다.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    total: jobs.length, // 전체 공고 개수
    active: jobs.filter(job => job.postingStatus === true).length, // 진행중 공고 개수
    closed: jobs.filter(job => job.postingStatus === false).length // 마감 공고 개수
  };

  return (
    <CompanyLayout>
      <Container>
        <Header>
          <h1>채용공고 관리</h1>
          <PostButton onClick={() => navigate('/jobs/post')}>새 공고 등록</PostButton>
        </Header>

        <Dashboard>
          <StatBox>
            <h3>전체 공고</h3>
            <span>{stats.total}</span>
          </StatBox>
          <StatBox>
            <h3>진행중</h3>
            <span>{stats.active}</span>
          </StatBox>
          <StatBox>
            <h3>마감</h3>
            <span>{stats.closed}</span>
          </StatBox>
        </Dashboard>

        <FilterSection>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}>
            전체
          </FilterButton>
          <FilterButton
            active={filter === '진행중'}
            onClick={() => setFilter('진행중')}>
            진행중
          </FilterButton>
          <FilterButton
            active={filter === '마감'}
            onClick={() => setFilter('마감')}>
            마감
          </FilterButton>
        </FilterSection>

        <JobGrid>
          {filteredJobs.length === 0 ? (
            <NoDataWrapper>검색 결과가 없습니다.</NoDataWrapper>
          ) : (
            currentJobs.map(job => (
              <JobCard key={job.jobCode} disabled={!job.postingStatus}>
                <Link to={`/jobs/${job.jobCode}`}>
                  {job.imageUrl && (
                    <Thumbnail>
                      <img src={job.imageUrl} alt="공고 이미지" />
                    </Thumbnail>
                  )}
                  <JobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <Location>{job.address}</Location>
                    <Salary>{job.salary}</Salary>
                    <Experience>
                      {job.workExperience === 0
                        ? '신입'
                        : job.workExperience === -1
                          ? '경력무관'
                          : job.workExperience > 0
                            ? `경력 ${job.workExperience}년`
                            : '경력 정보 없음'}
                    </Experience>
                    <SkillTags>
                      {job.skill && job.skill.split(',').map((skill, index) => (
                        <SkillTag key={index}>{skill.trim()}</SkillTag>
                      ))}
                    </SkillTags>
                    <Deadline>마감일: {format(new Date(job.postingDeadline), 'yyyy-MM-dd')}</Deadline>
                  </JobInfo>
                </Link>
              </JobCard>
            ))
          )}
        </JobGrid>

        {filteredJobs.length > 0 && (
          <Pagination>
            {[...Array(pageCount)].map((_, i) => (
              <PageButton
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        )}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PostButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
`;

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;

  h3 {
    color: #666;
    margin: 0;
  }

  span {
    font-size: 2rem;
    font-weight: bold;
    color: #2563eb;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px 0 5px;
  background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#4b5563'};
`;

const FilterSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const JobCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  opacity: ${(props) => (props.disabled ? 0.8 : 1)}; // 투명도 적용
  background-color: ${(props) => (props.disabled ? '#D3D3D3' : 'white')}; // 배경색 변경
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')}; // 클릭 비활성화

  &:hover {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-4px)')};
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')}; // 링크 클릭 비활성화
  }
`;

const Location = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const JobTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
`;

const Salary = styled.span`
  color: #2ecc71;
  font-weight: 500;
`;

const Experience = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span`
  background: #f0f2f5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #2c3e50;
`;

const Deadline = styled.span`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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
  border-radius: 4px;
  background: ${props => props.active ? '#3498db' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#2980b9' : '#cbd5e0'};
  }
`;

const NoDataWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


export default CompanyJobManagement;