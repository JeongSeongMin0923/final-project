import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import AdminLayout from "./AdminLayout";
import { useApiHost } from '../../context/ApiHostContext';

const AdminMember = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const token = localStorage.getItem('token');
  const { API_HOST } = useApiHost();

  const ROLE_MAPPING = {
    'ROLE_ADMIN': '관리자',
    'ROLE_COMPANY': '기업회원',
    'ROLE_USER': '개인회원'
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_HOST}/api/v1/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users data');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleWithdrawUser = async (userId, name) => {
    if (window.confirm(`'${name}' 회원을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await axios.delete(`${API_HOST}/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user.userId !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('회원 탈퇴 처리에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  return (
    <AdminLayout>
      <Container>
        <Title>회원 관리</Title>
        <Table>
          <thead>
            <tr>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>회원구분</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <UserRole type={user.role}>
                    {ROLE_MAPPING[user.role] || user.role}
                  </UserRole>
                </Td>
                <Td>
                  {user.role !== 'ROLE_ADMIN' && (
                    <DeleteButton onClick={() => handleWithdrawUser(user.id, user.name)}>
                      강제탈퇴
                    </DeleteButton>
                  )}
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
}


const Container = styled.div`
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      `;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #2d3748;
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

const DeleteButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
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
  border-radius: 4px;
  background: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#475569'};
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#cbd5e1'};
  }
`;

const UserRole = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.type) {
      case 'ROLE_ADMIN':
        return 'background: #e3f2fd; color: #1565c0;';
      case 'ROLE_COMPANY':
        return 'background: #e8f5e9; color: #2e7d32;';
      case 'ROLE_USER':
        return 'background: #fff3e0; color: #ef6c00;';
      default:
        return 'background: #f5f5f5; color: #666666;';
    }
  }}
`;

export default AdminMember;