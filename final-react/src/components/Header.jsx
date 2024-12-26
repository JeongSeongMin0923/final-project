import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../pages/AuthContent";

const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.2);
    }
    60% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  &:hover {
    img {
      animation: heartbeat 0.8s ease-in-out;
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #374151;

  &:hover {
    color: #2563eb;
  }
`;

const SubMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 160px;
  display: none;
  list-style: none;

  ${NavItem}:hover & {
    display: block;
  }
`;

const SubMenuItem = styled.li`
  padding: 0.5rem 1rem;
  color: #374151;
  
  &:hover {
    background: #f3f4f6;
    color: #2563eb;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
`;

const RightSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #2563eb;
    color: white;
    border: none;
    &:hover {
      background: #1d4ed8;
    }
  ` : `
    background: transparent;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover {
      border-color: #2563eb;
      color: #2563eb;
    }
  `}
`;

const Header = () => {

  const { name = '', userType = '', logout = () => { }, companyName, companyAddress, ceoName, companyType } = useAuth() || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log('로그아웃 완료');
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <StyledNavLink to="/">
            <img
              src="/devjobs_logo.png"
              alt="DevJobs Logo"
              style={{
                width: "100px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </StyledNavLink>
        </Logo>

        <NavList>
          <NavItem>
            채용
            <SubMenu>
              <SubMenuItem>
                <StyledNavLink to="/jobs">채용공고 목록</StyledNavLink>
              </SubMenuItem>
              {userType === "company" &&
                <SubMenuItem>
                  <StyledNavLink to="/jobs/post">채용등록</StyledNavLink>
                </SubMenuItem>
              }
              {/* <SubMenuItem>
                <StyledNavLink to="/jobs/1">채용공고 상세조회 예시페이지</StyledNavLink>
              </SubMenuItem> */}
            </SubMenu>
          </NavItem>

          {(userType === "dev" ||
            userType === "kakao" ||
            userType === "naver") && (
              <NavItem>
                이력서
                <SubMenu>
                  <SubMenuItem>
                    <StyledNavLink to="/resumes/post">이력서 등록</StyledNavLink>
                  </SubMenuItem>
                  {/* <SubMenuItem>
                <StyledNavLink to="/ResumeRead">이력서 조회</StyledNavLink>
                <StyledNavLink to="/resumes/read">이력서 조회 테스트</StyledNavLink>
              </SubMenuItem> */}
                  {/* <SubMenuItem>
                <StyledNavLink to="/ResumeEdit">이력서 수정</StyledNavLink>
                <StyledNavLink to="/resumes/edit">이력서 수정 테스트</StyledNavLink>
              </SubMenuItem> */}
                  <SubMenuItem>
                    <StyledNavLink to="/resumes/list">이력서 목록</StyledNavLink>
                  </SubMenuItem>
                  {/* <SubMenuItem>
                <StyledNavLink to="/TestResume">이력서 API 테스트</StyledNavLink>
              </SubMenuItem> */}
                </SubMenu>
              </NavItem>
            )}

          {/* <NavItem>
            Member
            <SubMenu>
              <SubMenuItem>

                <StyledNavLink to="/member/profile">마이페이지</StyledNavLink>
              </SubMenuItem>
            </SubMenu>
          </NavItem> */}

          {(userType === "dev" ||
            userType === "kakao" ||
            userType === "naver") && (
              <NavItem>
                페이지

                <SubMenu>

                  <SubMenuItem>
                    <StyledNavLink to="/profile/applications">공고 지원 관리</StyledNavLink>
                  </SubMenuItem>

                  {/* <SubMenuItem>
                <StyledNavLink to="/profile">구직자 마이페이지</StyledNavLink>
              </SubMenuItem>
              <SubMenuItem>
                <StyledNavLink to="/company_test">회사정보 테스트페이지</StyledNavLink>
              </SubMenuItem> */}
                  {userType === "admin" && (
                    <SubMenuItem>
                      <StyledNavLink to="/admin">관리자 메인 페이지</StyledNavLink>
                    </SubMenuItem>
                  )}
                </SubMenu>
              </NavItem>
            )}
          {userType === "admin" && (
            <NavItem>
              관리자 페이지
              <SubMenu>
                <SubMenuItem>
                  <StyledNavLink to="/admin">관리자 메인 페이지</StyledNavLink>
                </SubMenuItem>
              </SubMenu>
            </NavItem>
          )}


          {userType === "company" && (
            <>
              <NavItem>
                기업용 페이지
                <SubMenu>
                  <SubMenuItem>
                    <StyledNavLink to="/company">기업 대시보드</StyledNavLink>
                  </SubMenuItem>
                </SubMenu>
              </NavItem>
            </>
          )}

        </NavList>

        <RightSection>
          {userType ? (
            <>
              <span>{name} 님 안녕하세요</span>
              {userType === "kakao" || userType === "naver" ? (
                // 소셜 사용자용 마이페이지 버튼
                <Button onClick={() => navigate('/socialprofile')}>마이페이지</Button>
              ) : (
                // 일반 사용자용 마이페이지 버튼
                <Button onClick={() => navigate('/profile')}>마이페이지</Button>
              )}
              <Button onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/auth/sign-in')}>로그인</Button>
              <Button primary onClick={() => navigate('/auth/sign-up')}>회원가입</Button>
            </>
          )}

        </RightSection>
      </Nav>
    </HeaderContainer >
  );
};

export default Header;