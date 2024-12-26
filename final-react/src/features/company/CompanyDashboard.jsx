import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CompanyLayout from './CompanyLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from 'recharts';
import axios from 'axios';
import { useApiHost } from '../../context/ApiHostContext';

const CompanyDashboard = () => {
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

  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { API_HOST } = useApiHost();

  const [comStats, setComStats] = useState({
    totalComApplications: 0,
    ongoingComApplications: 0,
    finalCompletedApplications: 0,
  });

  useEffect(() => {
    const userCode = localStorage.getItem("userCode");
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기

    if (userCode && token) {
      axios
        .get(`${API_HOST}/apply/applications/count`, {
          params: { userCode },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setComStats((prevStats) => ({
            ...prevStats,
            totalComApplications: response.data.totalComApplications,
            ongoingComApplications: response.data.ongoingComApplications,
            finalCompletedApplications: response.data.finalApplications,
          }));
        })
        .catch((error) => {
          console.error("Error fetching application count:", error);
        });


    } else {
      console.error("Missing userCode or token in localStorage");
    }
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


  // 진행중인 공고 카운트
  useEffect(() => {
    fetchJob();
  }, []);

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

      const responseData = response.data;

      const jobMap = responseData.map(job => ({
        ...job,
      }));

      setJobs(jobMap);

    } catch (err) {
      setError(err.message || '채용공고를 불러오는데 실패했습니다.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: jobs.length, // 전체 공고 개수
    active: jobs.filter(job => job.postingStatus === true).length, // 진행중 공고 개수
    closed: jobs.filter(job => job.postingStatus === false).length // 마감 공고 개수
  };


  return (
    <CompanyLayout>
      <Container>
        <Title>대시보드</Title>

        <StatsGrid>
          <StatCard>
            <StatLabel>진행중인 공고</StatLabel>
            <StatValue>{stats.active}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>총 지원자</StatLabel>
            <StatValue>{comStats.totalComApplications}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>채용 진행중</StatLabel>
            <StatValue>{comStats.ongoingComApplications}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>채용 완료</StatLabel>
            <StatValue>{comStats.finalCompletedApplications}</StatValue>
          </StatCard>
        </StatsGrid>

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
      </Container>
    </CompanyLayout>
  );
};

const Container = styled.div`
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      `;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a365d;
  margin-bottom: 2rem;
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

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a365d;
  margin-bottom: 1.5rem;
`;

export default CompanyDashboard;