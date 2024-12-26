import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useApiHost } from '../../context/ApiHostContext';

const ITEMS_PER_PAGE = 9;

const JobListPage = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]); // 추천 공고 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    fetchJobs();
    fetchRecommendedJobs(1); // 예: 이력서 코드 1로 추천 공고 가져오기
  }, []);
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_HOST}/jobposting/list`);
      if (!response.data) throw new Error('데이터가 없습니다.');

      // 활성화된 공고만 필터링 후 역순 정렬
      const activeJobs = response.data.filter(job => job.postingStatus);
      const reversedData = [...activeJobs].reverse();

      const jobsWithImage = reversedData.map(job => ({
        ...job,
        imageUrl: job.imgPath ? `${job.imgPath}` : null
      }));

      setJobs(jobsWithImage);
      setFilteredJobs(jobsWithImage);
    } catch (error) {
      setError('공고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedJobs = async (resumeCode) => {
    try {
      const response = await axios.get(`${API_HOST}/similarposting/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },
      });
      if (response.status === 200) {
        setRecommendedJobs(response.data.slice(0, 4)); // 상위 4개 공고만 저장
      }
    } catch (error) {
      console.error("추천 공고 API 호출 실패:", error);
    }
  };

  const handleSkillFilter = useCallback((skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      // 검색어 검사 (대소문자 구분 없이 포함 여부 확인)
      const lowerCaseSearchTerm = searchTerm?.toLowerCase() || "";
      const matchesSearch =
        !searchTerm ||
        job.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.address?.toLowerCase().includes(lowerCaseSearchTerm);

      // 스킬 필터링: 선택된 스킬 키워드가 스킬 목록에 시작하는지 검사
      const allowedKeywords = ["react", "vue", "angular", "node.js", "java", "spring", "aws"];

      // job.skill을 배열로 변환하고 대소문자 무시
      const jobSkills = job.skill
        ?.split(',')
        .map(skill => skill.trim().toLowerCase()) || [];

      // 선택된 스킬이 없으면 모든 항목 통과, 선택된 스킬이 있으면 부분 매칭
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every(selectedSkill => {
          const lowerCaseSkill = selectedSkill.toLowerCase();
          return jobSkills.some(jobSkill =>
            allowedKeywords.includes(lowerCaseSkill) && jobSkill.startsWith(lowerCaseSkill)
          );
        });

      // 최종 조건: 검색어 검사 && 스킬 필터링
      return matchesSearch && matchesSkills;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSkills, jobs]);


  if (loading) return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;

  const pageCount = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container>
      <Header>
        <SearchBar
          type="text"
          placeholder="직무, 회사, 지역 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>

      <FilterSection>
        <SkillFilter>
          {["React", "Vue", "Angular", "Node.js", "Java", "Spring", "AWS"].map(skill => (
            <SkillButton
              key={skill}
              selected={selectedSkills.includes(skill)}
              onClick={() => handleSkillFilter(skill)}
            >
              {skill}
            </SkillButton>
          ))}
        </SkillFilter>
      </FilterSection>

      {/* 추천 공고 섹션 추가 */}
      {recommendedJobs.length > 0 && (
        <RecommendedSection>
          <h2>Ai 추천 공고</h2>
          <JobGrid>
            {recommendedJobs.map(job => (
              <HighlightedJobCard key={job.jobCode} disabled={!job.postingStatus}>
                <Link to={`/jobs/${job.jobCode}`}>
                  {job.imageUrl && (
                    <HighlightedThumbnail>
                      <img src={job.imageUrl} alt="추천 공고 이미지" />
                    </HighlightedThumbnail>
                  )}
                  <HighlightedJobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <Location>{job.address}</Location>
                    <Salary>{job.salary}</Salary>
                    <Experience>
                      {job.workExperience === 0
                        ? '신입'
                        : job.workExperience === -1
                          ? '경력무관'
                          : `경력 ${job.workExperience}년`}
                    </Experience>
                    <SkillTags>
                      {job.skill && job.skill.split(',').map((skill, index) => (
                        <HighlightedSkillTag key={index}>{skill.trim()}</HighlightedSkillTag>
                      ))}
                    </SkillTags>
                    <Deadline>
                      마감일: {format(new Date(job.postingDeadline), 'yyyy-MM-dd')}
                    </Deadline>
                    {!job.postingStatus && (
                      <div style={{ color: 'red', fontWeight: 'bold' }}>마감된 공고</div>
                    )}
                  </HighlightedJobInfo>
                </Link>
              </HighlightedJobCard>
            ))}
          </JobGrid>
        </RecommendedSection>
      )}
      <h2>구인 공고</h2>
      <JobGrid>
        {filteredJobs.length === 0 ? (
          <NoDataWrapper>검색 결과가 없습니다.</NoDataWrapper>
        ) : (
          currentJobs.map(job => (
            <JobCard key={job.jobCode} disabled={!job.postingStatus}>
              <Link to={`/jobs/${job.jobCode}`}>
                {job.imageUrl && (
                  <Thumbnail>
                    <img src={job.imageUrl} alt="공고 이미지" />
                  </Thumbnail>
                )}
                <JobInfo>
                  <JobTitle>{job.title}</JobTitle>
                  <Location>{job.address}</Location>
                  <Salary>{job.salary}</Salary>
                  <Experience>
                    {job.workExperience === 0
                      ? '신입'
                      : job.workExperience === -1
                        ? '경력무관'
                        : `경력 ${job.workExperience}년`}
                  </Experience>
                  <SkillTags>
                    {job.skill && job.skill.split(',').map((skill, index) => (
                      <SkillTag key={index}>{skill.trim()}</SkillTag>
                    ))}
                  </SkillTags>
                  <Deadline>
                    마감일: {format(new Date(job.postingDeadline), 'yyyy-MM-dd')}
                  </Deadline>
                  {!job.postingStatus && (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>마감된 공고</div>
                  )}
                </JobInfo>
              </Link>
            </JobCard>
          ))
        )}
      </JobGrid>

      {filteredJobs.length > 0 && (
        <Pagination>
          {[...Array(pageCount)].map((_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
        </Pagination>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FilterSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
`;

const SkillFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SkillButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background: ${props => props.selected ? '#3498db' : '#e2e8f0'};
  color: ${props => props.selected ? 'white' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.selected ? '#2980b9' : '#cbd5e0'};
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const JobCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  opacity: ${(props) => (props.disabled ? 0.8 : 1)}; // 투명도 적용
  background-color: ${(props) => (props.disabled ? '#D3D3D3' : 'white')}; // 배경색 변경
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')}; // 클릭 비활성화

  &:hover {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-4px)')};
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')}; // 링크 클릭 비활성화
  }
`;

const Location = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const JobTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
`;

const Salary = styled.span`
  color: #2ecc71;
  font-weight: 500;
`;

const Experience = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span`
  background: #f0f2f5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #2c3e50;
`;

const Deadline = styled.span`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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
  background: ${props => props.active ? '#3498db' : '#e2e8f0'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#2980b9' : '#cbd5e0'};
  }
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

const NoDataWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RecommendedSection = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    border-left: 5px solid #3498db; /* 파란색 강조 */
    padding-left: 0.5rem;
  }
`;

const HighlightedJobCard = styled(JobCard)`
  border: 2px solid #3498db; /* 파란색 테두리 */
  background-color: #f0f8ff; /* 파란색 톤의 배경 */
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.2); /* 파란색 그림자 효과 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px); /* 살짝 올라가는 효과 */
    box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4); /* 강조된 그림자 */
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
  }
`;

const HighlightedThumbnail = styled(Thumbnail)`
  img {
    border-bottom: 2px solid #3498db; /* 이미지 하단에 파란색 강조 */
  }
`;

const HighlightedJobInfo = styled(JobInfo)`
  h3 {
    color: #2c3e50; /* 제목 색상 */
    font-weight: bold;
    font-size: 1.25rem;
  }

  span {
    font-size: 0.9rem;
    color: #4a5568; /* 약간 어두운 텍스트 색상 */
  }
`;

const HighlightedSkillTag = styled(SkillTag)`
  background: #3498db; /* 파란색 배경 */
  color: white; /* 텍스트 색상 */
  font-weight: bold;
`;

export default JobListPage;