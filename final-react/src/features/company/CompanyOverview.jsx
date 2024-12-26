import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useApiHost } from '../../context/ApiHostContext';

const ITEMS_PER_PAGE = 9;

// 메인 컴포넌트
const CompanyOverview = () => {
  const navigate = useNavigate();
  const { API_HOST } = useApiHost();
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    logo: "https://via.placeholder.com/150",
    address: "",
    ceo: "",
    companyType: "",
    description: "",
    industry: "",
    website: "",
    activeJobs: [],
  });

  const { companyProfileCode } = useParams(); // URL 파라미터 가져오기  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // 채용 공고 쪽
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);



  const [applyStats] = useState({
    totalApplications: 158,
    activeJobs: 5,
    interviewScheduled: 12,
    hiredCandidates: 3
  });

  const applicationData = [
    { date: '3/1', count: 12 },
    { date: '3/2', count: 15 },
    { date: '3/3', count: 8 },
    { date: '3/4', count: 20 },
    { date: '3/5', count: 16 }
  ];

  const jobStats = [
    { name: '프론트엔드 개발자', applications: 45 },
    { name: '백엔드 개발자', applications: 38 },
    { name: 'DevOps 엔지니어', applications: 25 }
  ];

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
    try {
      setLoading(true);
      setError(null);

      // Authorization 헤더 추가
      const response = await axios.get(`${API_HOST}/companyprofile/by-user`, {
        headers: {
          Authorization: `Bearer ${token}` // Bearer 토큰 추가
        },
        params: {
          companyProfileCode: companyProfileCode // Query Parameter 추가
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


  const handleViewApplicants = (jobId) => {
    navigate(`/company/jobs/${jobId}/applicants`);
  };


  const recruitmentStages = [
    { name: '서류심사', value: 75 },
    { name: '1차면접', value: 45 },
    { name: '2차면접', value: 28 },
    { name: '최종합격', value: 15 }
  ];

  // 지원자 학력 분포
  const educationStats = [
    { name: '고졸', value: 15 },
    { name: '전문대졸', value: 25 },
    { name: '대졸', value: 45 },
    { name: '석사', value: 10 },
    { name: '박사', value: 5 }
  ];

  // 월별 지원자 추이
  const monthlyApplications = [
    { month: '1월', count: 35 },
    { month: '2월', count: 42 },
    { month: '3월', count: 58 },
    { month: '4월', count: 45 }
  ];

  // 직무별 경쟁률
  const competitionRate = [
    { position: '프론트엔드', rate: 15.2 },
    { position: '백엔드', rate: 12.8 },
    { position: 'DevOps', rate: 8.5 },
    { position: '데이터 분석', rate: 10.3 }
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (!companyProfileCode) {
      setError("회사 프로필 코드가 제공되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // JWT 토큰 가져오기
        const token = localStorage.getItem("token");

        // API 요청
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const response = await axios.get(
          `${API_HOST}/companyprofile/read/${companyProfileCode}`,
          { headers }
        );

        setCompanyInfo({
          name: response.data.companyName || "회사 이름 없음",
          logo: response.data.uploadFileName || "/default/logo.png",
          address: response.data.companyAddress || "주소 없음",
          ceo: response.data.ceoName || "대표 이름 없음",
          companyType: response.data.companyType || "기업 유형 없음",
          description: response.data.companyDescription || "기업 설명 없음",
          industry: response.data.industry || "업종 정보 없음",
          website: response.data.websiteUrl || "웹사이트 정보 없음",
          activeJobs: response.data.activeJobs || [],
        });
      } catch (error) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyProfileCode]); // companyProfileCode가 변경될 때마다 실행

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (

    <Container>
      {/* 회사 프로필 */}
      <Section>
        <Logo src={companyInfo.logo} alt="회사 로고" />
        <Info>
          <h1>{companyInfo.name}</h1>
          <p>대표: {companyInfo.ceo}</p>
          <p>주소: {companyInfo.address}</p>
          <p>기업 유형: {companyInfo.companyType}</p>
          <p>업종: {companyInfo.industry}</p>
          <a href={companyInfo.website}>웹사이트 방문</a>
        </Info>
      </Section>

      {/* 채용 대시보드 */}



      <ChartGrid>
        <ChartCard>
          <ChartTitle>일별 지원자 현황</ChartTitle>
          <LineChart width={500} height={300} data={applicationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ChartCard>

        <ChartCard>
          <ChartTitle>공고별 지원자 현황</ChartTitle>
          <BarChart width={500} height={300} data={jobStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#82ca9d" />
          </BarChart>
        </ChartCard>
      </ChartGrid>


      {/* 채용 공고 관리 */}
      <Header>
        <h1>채용공고 관리</h1>
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

      {/* 통계 */}
      <Header>
        <h1>채용 통계</h1>
      </Header>
      <Grid>
        <Card>
          <CardTitle>채용 단계별 현황</CardTitle>
          <BarChart width={500} height={300} data={recruitmentStages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </Card>

        <Card>
          <CardTitle>지원자 학력 분포</CardTitle>
          <PieChart width={500} height={300}>
            <Pie
              data={educationStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {educationStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>

        <Card>
          <CardTitle>월별 지원자 추이</CardTitle>
          <AreaChart width={500} height={300} data={monthlyApplications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </Card>

        <Card>
          <CardTitle>직무별 경쟁률</CardTitle>
          <BarChart width={500} height={300} data={competitionRate} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="position" type="category" />
            <Tooltip />
            <Bar dataKey="rate" fill="#0088FE" />
          </BarChart>
        </Card>
      </Grid>
    </Container>
  );
};

// 스타일 정의
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#4b5563'};
`;

const JobList = styled.div`
  display: flex;
  gap: 1rem;
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.div`
  display: flex;
  gap: 3rem;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
  transition: all 0.3s ease;
`;

const Logo = styled.img`
  width: 160px;
  height: 180px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Info = styled.div`
  flex: 1;
  color : #64748b;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  color: #1a365d;
  font-size: 1.5rem;
  font-weight: bold;
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

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
`;

const ChartCard = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
`;


const Title = styled.h1`
  font-size: 2rem;
  color: #1a365d;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Location = styled.span`
  font-size: 0.9rem;
  color: #666;
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



export default CompanyOverview;