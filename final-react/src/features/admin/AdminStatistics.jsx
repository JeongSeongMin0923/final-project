// import { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from './AdminLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, Line, LineChart, AreaChart, Area
} from 'recharts';

const AdminStatistics = () => {
  // 임시 데이터
  const monthlyData = [
    { month: '1월', 구직자: 120, 기업회원: 45 },
    { month: '2월', 구직자: 150, 기업회원: 52 },
    { month: '3월', 구직자: 180, 기업회원: 61 },
    { month: '4월', 구직자: 220, 기업회원: 75 }
  ];

  const jobCategoryData = [
    { name: '프론트엔드', value: 35 },
    { name: '백엔드', value: 40 },
    { name: '풀스택', value: 25 },
    { name: 'DevOps', value: 20 },
    { name: '모바일', value: 15 }
  ];

  const applicationStats = [
    { date: '03/01', 지원수: 45 },
    { date: '03/02', 지원수: 52 },
    { date: '03/03', 지원수: 49 },
    { date: '03/04', 지원수: 63 },
    { date: '03/05', 지원수: 58 }
  ];

  const recruitmentTrends = [
    { month: '1월', 신규공고: 25, 마감공고: 15, 채용성공: 10 },
    { month: '2월', 신규공고: 30, 마감공고: 20, 채용성공: 12 },
    { month: '3월', 신규공고: 35, 마감공고: 22, 채용성공: 15 },
    { month: '4월', 신규공고: 40, 마감공고: 25, 채용성공: 18 }
  ];

  const skillDemand = [
    { name: 'JavaScript', 수요: 80 },
    { name: 'Python', 수요: 65 },
    { name: 'Java', 수요: 60 },
    { name: 'React', 수요: 55 },
    { name: 'Node.js', 수요: 45 }
  ];


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <AdminLayout>
      <Container>
        <Title>통계 대시보드</Title>

        <Grid>
          <Card>
            <CardTitle>회원 현황</CardTitle>
            <BarChart width={500} height={300} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="구직자" fill="#0088FE" />
              <Bar dataKey="기업회원" fill="#00C49F" />
            </BarChart>
          </Card>

          <Card>
            <CardTitle>직무별 채용공고 비율</CardTitle>
            <PieChart width={500} height={300}>
              <Pie
                data={jobCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>

          <Card>
            <CardTitle>일별 지원 현황</CardTitle>
            <AreaChart width={500} height={300} data={applicationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="지원수" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </Card>

          <Card>
            <CardTitle>채용 추이</CardTitle>
            <LineChart width={500} height={300} data={recruitmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="신규공고" stroke="#8884d8" />
              <Line type="monotone" dataKey="마감공고" stroke="#82ca9d" />
              <Line type="monotone" dataKey="채용성공" stroke="#ffc658" />
            </LineChart>
          </Card>

          <Card>
            <CardTitle>기술 스택 수요</CardTitle>
            <BarChart width={500} height={300} data={skillDemand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="수요" fill="#8884d8" />
            </BarChart>
          </Card>

          <KPIContainer>
            <KPICard>
              <KPITitle>총 채용공고</KPITitle>
              <KPIValue>358</KPIValue>
              <KPIChange positive>+12.5%</KPIChange>
            </KPICard>
            <KPICard>
              <KPITitle>평균 지원자 수</KPITitle>
              <KPIValue>24.5</KPIValue>
              <KPIChange positive>+8.3%</KPIChange>
            </KPICard>
            <KPICard>
              <KPITitle>평균 채용 소요일</KPITitle>
              <KPIValue>18일</KPIValue>
              <KPIChange negative>-5.2%</KPIChange>
            </KPICard>
          </KPIContainer>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

const Container = styled.div`
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      `;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const KPIContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const KPICard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
`;

const KPITitle = styled.h3`
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const KPIValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const KPIChange = styled.div`
  font-size: 0.875rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  &:before {
    content: '${props => props.positive ? '↑' : '↓'}';
  }
`;

export default AdminStatistics;