import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ROUTES } from './constants/routes';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// User Features
import SignIn from './features/user/view/Authentication/SignIn';
import SignUp from './features/user/view/Authentication/SignUp';
import OAuthCallback from './pages/OAuthCallback';
import UserMyPage from './features/user/view/MyPage/UserMyPage';
import ProfileEdit from './features/user/view/MyPage/UserProfileEdit';

// Pages
import Home from './pages/Home';
import ApplicationManagement from './pages/ApplicationManagement'; // 오타 수정

// Job Features
import JobListPage from './features/job/JobListPage';
import JobPosting from './features/job/JobPosting';
import JobPostDetail from './features/job/JobPostDetail';
import JobResumeSubmit from './features/job/JobResumeSubmit';

// Resume Features
import ResumePosting from './features/resume/ResumePosting';
import ResumeEdit from './features/resume/ResumeEdit';
import ResumeRead from './features/resume/ResumeRead';
import ResumeList from './features/resume/ResumeList';

// Company Features
import CompanyProfile from './features/company/CompanyProfile';
import CompanyDashboard from './features/company/CompanyDashboard'
import CompanyApplications from './features/company/CompanyApplications'
import CompanyJobManagement from './features/company/CompanyJobManagement'
import CompanyStatistics from './features/company/CompanyStatisics'
import CompanyApplicantList from './features/company/CompanyApplicantList'
import CompanyProfileManage from './features/company/CompanyProfileManage'


// Admin Features
import AdminMain from './features/admin/AdminMain';
import AdminJobs from './features/admin/AdminJobs';
import AdminMember from './features/admin/AdminMember';
import AdminStatistics from './features/admin/AdminStatistics';
import AdminMatching from './features/admin/AdminMatching';

// API Test
import TestResume from './TestResume';
import JobPostEdit from './features/job/JobPostEdit';
import UserSocialMyPage from './features/user/view/MyPage/UserSocialMyPage';
import CompanyOverview from './features/company/CompanyOverview';
import ApplicationDetail from './pages/ApplicationDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          {/* 메인 */}
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* 채용공고 관련 */}
          <Route path={ROUTES.JOB.LIST} element={<JobListPage />} />
          <Route path={ROUTES.JOB.POST} element={<JobPosting />} />
          <Route path={ROUTES.JOB.DETAIL} element={<JobPostDetail />} />
          <Route path={ROUTES.JOB.EDIT} element={<JobPostEdit />} />
          <Route path={ROUTES.JOB.APPLY} element={<JobResumeSubmit />} />

          {/* 이력서 관련 */}
          <Route path={ROUTES.RESUME.LIST} element={<ResumeList />} />
          <Route path={ROUTES.RESUME.POST} element={<ResumePosting />} />
          <Route path={ROUTES.RESUME.EDIT} element={<ResumeEdit />} />
          <Route path={ROUTES.RESUME.READ} element={<ResumeRead />} />
          <Route path={ROUTES.RESUME.READ_TEST} element={<ResumeRead />} />

          {/* 프로필/마이페이지 관련 */}
          {/* <Route path={ROUTES.PROFILE.APPLICATIONS} element={<ApplicationManagement />} /> */}
          <Route path={ROUTES.PROFILE.COMPANY_TEST} element={<CompanyProfile />} />
          <Route path={ROUTES.PROFILE.APPLICATIONS} element={<ApplicationManagement />} />
          <Route path={ROUTES.PROFILE.MY_PAGE} element={<UserMyPage />} />
          <Route path={ROUTES.PROFILE.SOCIAL_MY_PAGE} element={<UserSocialMyPage />} />
          <Route path={ROUTES.PROFILE.EDIT} element={<ProfileEdit />} />
          <Route path={ROUTES.PROFILE.APPLICATION_DETAIL} element={<ApplicationDetail />} />

          {/* <Route path={ROUTES.PROFILE.COMPANY_TEST} element={<CompanyDetail />} /> */}

          {/* 로그인/회원가입 관련 */}
          <Route path={ROUTES.USER.REGISTER} element={<SignUp />} />
          <Route path={ROUTES.USER.LOGIN} element={<SignIn />} />
          <Route path="/auth/oauth-response/:token/:userCode/:email/:name/:type/:expirationTime" element={<OAuthCallback />} />


          {/* 관리자 페이지 */}
          <Route path={ROUTES.ADMIN.ADMIN} element={<AdminMain />} />
          <Route path={ROUTES.ADMIN.JOBS} element={<AdminJobs />} />
          <Route path={ROUTES.ADMIN.MEMBER} element={<AdminMember />} />
          <Route path={ROUTES.ADMIN.STATISTICS} element={<AdminStatistics />} />
          <Route path={ROUTES.ADMIN.MATCHING} element={<AdminMatching />} />

          {/* 기업용 페이지 */}
          <Route path={ROUTES.COMPANY.COMPANY} element={<CompanyDashboard />} />
          <Route path={ROUTES.COMPANY.JOBS} element={<CompanyJobManagement />} />
          <Route path={ROUTES.COMPANY.APPLICATIONS} element={<CompanyApplications />} />
          <Route path={ROUTES.COMPANY.STATISTICS} element={<CompanyStatistics />} />
          <Route path={ROUTES.COMPANY.PROFILE} element={<CompanyProfile />} />
          <Route path="/company/jobs/:jobId/applicants" element={<CompanyApplicantList />} />
          <Route path={ROUTES.COMPANY.PROFILE_EDIT} element={<CompanyProfileManage />} />
          <Route path="/company/read/:companyProfileCode" element={<CompanyOverview />} />

          {/* API 테스트용 */}
          <Route path="/TestResume" element={<TestResume />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
