// AdminLayout.jsx
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Container>
      <Sidebar>
        <Logo>Admin Dashboard</Logo>
        <Nav>
          <NavItem active={location.pathname === '/admin'}>
            <Link to="/admin">대시보드</Link>
          </NavItem>
          <NavItem active={location.pathname === '/admin/jobs'}>
            <Link to="/admin/jobs">채용공고 관리</Link>
          </NavItem>
          <NavItem active={location.pathname === '/admin/members'}>
            <Link to="/admin/members">회원 관리</Link>
          </NavItem>
          <NavItem active={location.pathname === '/admin/statistics'}>
            <Link to="/admin/statistics">통계</Link>
          </NavItem>
          <NavItem active={location.pathname === '/admin/matching'}>
            <Link to="/admin/matching">매칭</Link>
          </NavItem>
        </Nav>
      </Sidebar>
      <Main>{children}</Main>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #1e293b;
  color: white;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
`;
const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.div`
  a {
    display: block;
    padding: 0.75rem 1rem;
    color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
    text-decoration: none;
    border-radius: 6px;
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 250px; // Sidebar 너비만큼 여백
  padding: 2rem;
  background: #f1f5f9;
  min-height: 100vh;
  overflow-y: auto;
`;

export default AdminLayout;