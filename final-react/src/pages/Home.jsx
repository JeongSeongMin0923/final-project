import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import StyledCarousel from '../components/StyledCarousel';
import { Link } from 'react-router-dom';
import { useApiHost } from '../context/ApiHostContext';

const Home = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ITEM_PER_PAGE = 8; // 페이지당 표시할 아이템 수
  const { API_HOST } = useApiHost();

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_HOST}/jobposting/list`); // Job 데이터 가져오기
      if (!response.data) throw new Error('데이터가 없습니다.');

      // 이미지 경로 추가(imgPath 사용)
      const jobWithImage = response.data
        .map(job => ({
          ...job,
          companyLogo: job.imgPath || 'https://via.placeholder.com/150',
          companyName: job.profile.companyName || '기업명 미상',
          postingDate: job.postingDate ? new Date(job.postingDate) : null, // LocalDateTime 파싱
        }))
        .sort((a, b) => {
          return b.postingDate - a.postingDate; // 최신순 정렬
        });

      setJobListings(jobWithImage);
    } catch (err) {
      setError(err.message || '데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }

  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchJobListings();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;

  return (
    <div className="home">
      <section className="hero">
        <div className="banner-carousel">
          <StyledCarousel />
        </div>
      </section>

      {/* 채용공고 리스트 */}
      <section className="job-list">
        <Grid container spacing={3} style={{ marginTop: '2rem' }}>
          {jobListings
            .filter(job => job.postingStatus !== false) // 마감된 공고 제외
            .slice(0, ITEM_PER_PAGE) // 페이지당 아이템 수만큼 표시
            .map((job, index) => ( // 첫 페이지 아이템만 표시
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Link to={`/jobs/${job.jobCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Paper
                    elevation={3}
                    style={{
                      padding: '1.5rem',
                      textAlign: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    {/* 공고 이미지 */}
                    <img
                      src={job.companyLogo} // 연동된 이미지 경로
                      alt={job.companyName}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    공고 정보
                    <Typography variant="h6" style={{ margin: '1rem 0' }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.companyName || '기업명 미상'}
                    </Typography>
                    <Typography variant="body2" style={{ margin: '0.5rem 0' }}>
                      {job.address || '위치 정보 없음'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      급여: {job.salary || '협의 후 결정'}
                    </Typography>
                    {/* 기술 스택 */}
                    <div style={{ marginTop: '1rem' }}>
                      {job.skill?.split(',').map((skill, idx) => (
                        <Button
                          key={idx}
                          variant="outlined"
                          size="small"
                          style={{ margin: '4px', textTransform: 'none' }}
                        >
                          {skill.trim()}
                        </Button>
                      ))}
                    </div>
                  </Paper>
                </Link>
              </Grid>
            ))}
        </Grid>
      </section>
    </div>
  );
};


// const Home = () => (
//   <div className="home">
//     <section className="hero">
//       <div className="banner-carousel">
//         <StyledCarousel />
//       </div>
//     </section>
//     <section className="job-list">
//       <Grid container spacing={3} style={{ marginTop: '2rem' }}>
//         {jobListings.map((job, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Paper
//               elevation={3}
//               style={{
//                 padding: '1.5rem',
//                 textAlign: 'center',
//                 borderRadius: '8px',
//                 backgroundColor: '#f9f9f9',
//               }}
//             >
//               <img
//                 src={job.companyLogo}
//                 alt={job.companyName}
//                 style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
//               />
//               <Typography variant="h6" style={{ margin: '1rem 0' }}>
//                 {job.title}
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 {job.companyName}
//               </Typography>
//               <Typography variant="body2" style={{ margin: '0.5rem 0' }}>
//                 {job.location}
//               </Typography>
//               <div style={{ marginTop: '1rem' }}>
//                 {job.skills.map((skill, idx) => (
//                   <Button
//                     key={idx}
//                     variant="outlined"
//                     size="small"
//                     style={{
//                       margin: '4px',
//                       textTransform: 'none',
//                     }}
//                   >
//                     {skill}
//                   </Button>
//                 ))}
//               </div>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </section>
//   </div>
// );

export default Home;