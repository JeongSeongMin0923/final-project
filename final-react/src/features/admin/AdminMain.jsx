import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import {
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import styled from 'styled-components';
import { useApiHost } from '../../context/ApiHostContext';

const ROLE_MAPPING = {
  'ROLE_ADMIN': '관리자',
  'ROLE_COMPANY': '기업회원',
  'ROLE_USER': '일반회원'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const STATUS_MAPPING = {
  true: '활성',
  false: '마감'
};

const JOB_COLORS = ['#4CAF50', '#F44336'];

const AdminMain = () => {
  const [users, setUsers] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const { API_HOST } = useApiHost();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_HOST}/api/v1/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setUserCount(response.data.length);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users data');
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

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

  const userChartData = [
    { name: '기업회원', value: users.filter(user => user.role === 'ROLE_COMPANY').length },
    { name: '일반회원', value: users.filter(user => user.role === 'ROLE_USER').length },
    { name: '관리자', value: users.filter(user => user.role === 'ROLE_ADMIN').length }
  ];

  const jobChartData = [
    { name: '활성 공고', value: jobPostings.filter(job => job.postingStatus === true).length },
    { name: '마감 공고', value: jobPostings.filter(job => job.postingStatus === false).length }
  ];

  if (loading) return <LoadingText>로딩중...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <AdminLayout>
      <DashboardContainer>
        <StatSection>
          <StatCard>
            <StatTitle>전체 회원수</StatTitle>
            <StatNumber>{userCount}명</StatNumber>
          </StatCard>

          <StatCard>
            <StatTitle>전체 채용공고</StatTitle>
            <StatNumber>{jobPostings.length}개</StatNumber>
          </StatCard>
        </StatSection>

        <ChartSection>
          <ChartCard>
            <StatTitle>회원 구성</StatTitle>
            <PieChart width={400} height={300}>
              <Pie
                data={userChartData}
                cx={200}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}명`}
              >
                {userChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard>
            <StatTitle>채용공고 현황</StatTitle>
            <PieChart width={400} height={300}>
              <Pie
                data={jobChartData}
                cx={200}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}개`}
              >
                {jobChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={JOB_COLORS[index % JOB_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>
        </ChartSection>

        <UserListCard>
          <StatTitle>최근 가입 회원</StatTitle>
          <UserList>
            {users.slice(0, 5).map(user => (
              <UserItem key={user.userId}>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
                <UserRole>{ROLE_MAPPING[user.role]}</UserRole>
              </UserItem>
            ))}
          </UserList>
        </UserListCard>
      </DashboardContainer>
    </AdminLayout >
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ChartCard = styled(StatCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserListCard = styled(StatCard)`
  margin-top: 2rem;
`;

const StatTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const UserEmail = styled.span`
  color: #666;
`;

const UserRole = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 0.875rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #c62828;
  font-size: 1.2rem;
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

export default AdminMain;