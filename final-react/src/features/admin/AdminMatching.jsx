import { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from './AdminLayout';

const AdminMatching = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('전체');
  const ITEMS_PER_PAGE = 10;

  // 임시 매칭 데이터
  const [matchings] = useState([
    {
      id: 1,
      jobSeeker: "홍길동",
      company: "테크스타트",
      position: "프론트엔드 개발자",
      matchScore: 95,
      status: "매칭완료",
      appliedDate: "2024-03-15"
    },
    {
      id: 2,
      jobSeeker: "김철수",
      company: "네오테크",
      position: "백엔드 개발자",
      matchScore: 88,
      status: "면접진행중",
      appliedDate: "2024-03-16"
    },
    {
      id: 3,
      jobSeeker: "이영희",
      company: "디지털솔루션",
      position: "풀스택 개발자",
      matchScore: 92,
      status: "매칭완료",
      appliedDate: "2024-03-14"
    },
    {
      id: 4,
      jobSeeker: "박준서",
      company: "클라우드테크",
      position: "DevOps 엔지니어",
      matchScore: 85,
      status: "면접진행중",
      appliedDate: "2024-03-13"
    },
    {
      id: 5,
      jobSeeker: "최민지",
      company: "모바일코리아",
      position: "iOS 개발자",
      matchScore: 78,
      status: "매칭실패",
      appliedDate: "2024-03-12"
    },
    {
      id: 6,
      jobSeeker: "정상훈",
      company: "AI솔루션즈",
      position: "머신러닝 엔지니어",
      matchScore: 94,
      status: "매칭완료",
      appliedDate: "2024-03-11"
    },
    {
      id: 7,
      jobSeeker: "강다희",
      company: "웹테크놀로지",
      position: "프론트엔드 개발자",
      matchScore: 89,
      status: "면접진행중",
      appliedDate: "2024-03-10"
    },
    {
      id: 8,
      jobSeeker: "임재현",
      company: "데이터시스템",
      position: "데이터 엔지니어",
      matchScore: 91,
      status: "매칭완료",
      appliedDate: "2024-03-09"
    },
    {
      id: 9,
      jobSeeker: "송민수",
      company: "보안솔루션",
      position: "보안 엔지니어",
      matchScore: 82,
      status: "매칭실패",
      appliedDate: "2024-03-08"
    },
    {
      id: 10,
      jobSeeker: "유지원",
      company: "게임스튜디오",
      position: "게임 클라이언트 개발자",
      matchScore: 87,
      status: "면접진행중",
      appliedDate: "2024-03-07"
    },
    {
      id: 11,
      jobSeeker: "윤서연",
      company: "핀테크랩",
      position: "백엔드 개발자",
      matchScore: 93,
      status: "매칭완료",
      appliedDate: "2024-03-06"
    },
    {
      id: 12,
      jobSeeker: "한동욱",
      company: "블록체인테크",
      position: "블록체인 개발자",
      matchScore: 86,
      status: "면접진행중",
      appliedDate: "2024-03-05"
    }
  ]);

  const getFilteredMatchings = () => {
    if (activeFilter === '전체') return matchings;
    return matchings.filter(match => match.status === activeFilter);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // 필터 변경시 첫 페이지로 이동
  };

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>인재 매칭 현황</Title>
          <FilterSection>
            {['전체', '매칭완료', '면접진행중', '매칭실패'].map(filter => (
              <FilterButton
                key={filter}
                active={activeFilter === filter}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </FilterButton>
            ))}
          </FilterSection>
        </Header>

        <Table>
          <thead>
            <tr>
              <Th>지원자</Th>
              <Th>기업명</Th>
              <Th>포지션</Th>
              <Th>매칭점수</Th>
              <Th>상태</Th>
              <Th>지원일</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {getFilteredMatchings().map(match => (
              <Tr key={match.id}>
                <Td>{match.jobSeeker}</Td>
                <Td>{match.company}</Td>
                <Td>{match.position}</Td>
                <Td>
                  <MatchScore score={match.matchScore}>
                    {match.matchScore}%
                  </MatchScore>
                </Td>
                <Td>
                  <Status status={match.status}>{match.status}</Status>
                </Td>
                <Td>{match.appliedDate}</Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton>상세보기</ActionButton>
                    <ActionButton>매칭취소</ActionButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
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

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: ${props => props.active ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#e2e8f0'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const MatchScore = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  background: ${props => {
    if (props.score >= 90) return '#dcfce7';
    if (props.score >= 70) return '#fef9c3';
    return '#fee2e2';
  }};
  color: ${props => {
    if (props.score >= 90) return '#166534';
    if (props.score >= 70) return '#854d0e';
    return '#991b1b';
  }};
`;

const Status = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case '매칭완료':
        return 'background: #dcfce7; color: #166534;';
      case '면접진행중':
        return 'background: #e0f2fe; color: #075985;';
      default:
        return 'background: #fee2e2; color: #991b1b;';
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
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

export default AdminMatching;