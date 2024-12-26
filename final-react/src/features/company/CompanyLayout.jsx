import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const CompanyLayout = ({ children }) => {
  const location = useLocation();

  return (
    <Container>
      <Sidebar>
        <Logo>기업 서비스</Logo>
        <Nav>
          <NavItem active={location.pathname === '/company'}>
            <Link to="/company">대시보드</Link>
          </NavItem>
          <NavItem active={location.pathname === '/company/jobs'}>
            <Link to="/company/jobs">채용공고 관리</Link>
          </NavItem>
          <NavItem active={location.pathname === '/company/applications'}>
            <Link to="/company/applications">지원자 관리</Link>
          </NavItem>
          <NavItem active={location.pathname === '/company/statistics'}>
            <Link to="/company/statistics">채용 통계</Link>
          </NavItem>
          <NavItem active={location.pathname === '/company/profile'}>
            <Link to="/company/profile">기업 정보</Link>
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
  background: #1a365d;
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
    transition: all 0.2s;
    background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

export default CompanyLayout;