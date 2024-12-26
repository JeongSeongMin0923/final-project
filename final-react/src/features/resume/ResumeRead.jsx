import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FaBriefcase, FaGraduationCap, FaCertificate, FaLanguage,
  FaTools, FaUserTie, FaFileAlt, FaCalendarAlt
} from 'react-icons/fa';
import { useApiHost } from '../../context/ApiHostContext';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  animation: ${fadeIn} 1s ease-out;
`;

const ResumeTitle = styled.h1`
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  /* border-bottom: 2px solid #3498db; */
  padding-bottom: 10px;
`;

const Section = styled.section`
  margin-bottom: 30px;
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 20px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
    color: #3498db;
  }
`;

const ItemContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ItemTitle = styled.h3`
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
`;

const ItemDetail = styled.p`
  font-size: 18px;
  color: #34495e;
  margin: 10px 0;
  line-height: 1.6;
  
  strong {
    color: #2980b9;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 1.5s infinite alternate;
`;

const ResumeLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &:hover {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
`;

const ResumeRead = () => {
  const { resumeCode } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { API_HOST } = useApiHost();

  useEffect(() => {
    const fetchResumeData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_HOST}/resume/read/${resumeCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          setResumeData(response.data);
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeCode]);

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingText>이력서 정보를 불러오는 중...</LoadingText>
      </LoadingOverlay>
    );
  }

  if (!resumeData) {
    return <PageContainer>이력서를 찾을 수 없습니다.</PageContainer>;
  }

  return (
    <PageContainer>
      <ResumeTitle>{resumeData.work}</ResumeTitle>

      <Section>
        <SectionTitle><FaUserTie /> 자기소개</SectionTitle>
        <ItemDetail>{resumeData.introduce}</ItemDetail>
      </Section>

      <Section>
        <SectionTitle><FaBriefcase /> 경력</SectionTitle>
        {resumeData.experienceDetail.map((exp, index) => (
          <ItemContainer key={index}>
            <ItemTitle>{exp.company} - {exp.position}</ItemTitle>
            <ItemDetail><strong>부서:</strong> {exp.department}</ItemDetail>
            <ItemDetail><strong>담당업무:</strong> {exp.responsibility}</ItemDetail>
            <ItemDetail><strong>연봉:</strong> {exp.salary}</ItemDetail>
            <ItemDetail><strong>재직기간:</strong> {exp.startDate} - {exp.endDate}</ItemDetail>
          </ItemContainer>
        ))}
      </Section>

      <Section>
        <SectionTitle><FaGraduationCap /> 학력</SectionTitle>
        {resumeData.education.map((edu, index) => (
          <ItemContainer key={index}>
            <ItemTitle>{edu.school}</ItemTitle>
            <ItemDetail><strong>전공:</strong> {edu.major}</ItemDetail>
            <ItemDetail><strong>날짜:</strong> {edu.date}</ItemDetail>
          </ItemContainer>
        ))}
      </Section>

      <Section>
        <SectionTitle><FaCertificate /> 자격증</SectionTitle>
        {resumeData.certifications.map((cert, index) => (
          <ItemContainer key={index}>
            <ItemTitle>{cert.certificationName}</ItemTitle>
            <ItemDetail><strong>발급일:</strong> {cert.issueDate}</ItemDetail>
            <ItemDetail><strong>발급기관:</strong> {cert.issuer}</ItemDetail>
          </ItemContainer>
        ))}
      </Section>

      <Section>
        <SectionTitle><FaLanguage /> 언어 능력</SectionTitle>
        {resumeData.languageSkills.map((lang, index) => (
          <ItemContainer key={index}>
            <ItemTitle>{lang.language}</ItemTitle>
            <ItemDetail><strong>수준:</strong> {lang.level}</ItemDetail>
          </ItemContainer>
        ))}
      </Section>

      <Section>
        <SectionTitle><FaTools /> 기술 스킬</SectionTitle>
        <ItemDetail>{resumeData.skill}</ItemDetail>
      </Section>

      <Section>
        <SectionTitle><FaUserTie /> 희망 직무</SectionTitle>
        <ItemDetail>{resumeData.jobCategory}</ItemDetail>
      </Section>

      <Section>
        <SectionTitle><FaFileAlt /> 첨부 이력서</SectionTitle>
        <ItemDetail>
          {resumeData.uploadFileName ? (
            <>
              현재 첨부된 이력서:{" "}
              <ResumeLink
                href={resumeData.uploadFileName}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                {resumeData.uploadFileName.split('/').pop() || "다운로드"}
              </ResumeLink>
            </>
          ) : (
            "이력서가 첨부되지 않았습니다."
          )}
        </ItemDetail>
      </Section>

      <Section>
        <SectionTitle><FaCalendarAlt /> 마지막 수정일</SectionTitle>
        <ItemDetail>
          {resumeData.updateDate && !isNaN(new Date(resumeData.updateDate))
            ? format(new Date(resumeData.updateDate), 'yyyy-MM-dd')
            : "수정일이 없습니다."}
        </ItemDetail>
      </Section>
    </PageContainer>
  );
};

export default ResumeRead;

