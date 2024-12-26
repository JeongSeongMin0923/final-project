import styled from 'styled-components';
import CompanyLayout from './CompanyLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const CompanyStatistics = () => {
  // 채용 단계별 통계
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

  return (
    <CompanyLayout>
      <Container>
        <Title>채용 통계</Title>

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
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

export default CompanyStatistics;