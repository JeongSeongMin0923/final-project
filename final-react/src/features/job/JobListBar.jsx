import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useApiHost } from '../../context/ApiHostContext';

const JobListBar = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_HOST}/jobposting/list`);
        if (!response.data) throw new Error('데이터가 없습니다.');

        const reversedData = [...response.data].reverse().slice(0, 5);
        setJobs(reversedData);
      } catch (err) {
        setError(err.message || '채용공고를 불러오는데 실패했습니다.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;

  return (
    <Container>
      <Title>최근 채용공고</Title>
      <JobList>
        {jobs.map(job => (
          <JobItem key={job.jobCode}>
            <Link to={`/jobs/${job.jobCode}`}>
              <JobTitle>{job.title}</JobTitle>
              <JobInfo>
                <div>{job.recruitJob}</div>
                <div>{job.address}</div>
                <SkillTags>
                  {job.skill && job.skill.split(',').map((skill, index) => (
                    <SkillTag key={index}>{skill.trim()}</SkillTag>
                  ))}
                </SkillTags>
              </JobInfo>
            </Link>
          </JobItem>
        ))}
      </JobList>
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobItem = styled.div`
  border-radius: 8px;
  background: #f8fafc;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1rem;
  }
`;

const JobTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
`;

const JobInfo = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span`
  background: #f0f2f5;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: #2c3e50;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ErrorWrapper = styled.div`
  color: red;
  text-align: center;
  padding: 2rem;
`;

export default JobListBar;