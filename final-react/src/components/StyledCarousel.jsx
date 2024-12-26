import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';

const StyledCarousel = () => {
  return (
    <Carousel>
      <Paper
        sx={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          개발자와 기업의 연결, 여기서 시작됩니다
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
          당신의 다음 커리어를 위한 최고의 기회를 찾아보세요
        </p>
        <Button
          className="primary-button"
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: '20px', padding: '0.8rem 2rem' }}
        >
          채용 공고 보기
        </Button>
      </Paper>
      <Paper
        sx={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#e3f2fd',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          borderRadius: '10px',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          손쉬운 채용 프로세스
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
          수많은 기업들이 이미 경험하고 있습니다
        </p>
        <Button
          className="primary-button"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ borderRadius: '20px', padding: '0.8rem 2rem' }}
        >
          기업 서비스 알아보기
        </Button>
      </Paper>
    </Carousel>
  );
};

export default StyledCarousel;