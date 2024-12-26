import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApiHost } from '../../context/ApiHostContext';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f2f5;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: 950px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.hasError ? '#e74c3c' : '#bdc3c7')};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
`;

const QuillWrapper = styled.div`
  .ql-container {
    min-height: 300px;
    font-size: 1rem;
  }

  .ql-editor {
    min-height: 300px;
  }
`;

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const getOneWeekLater = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 16);
};

const JobPosting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recruitJob: '',
    recruitField: '',
    salary: '',
    postingStatus: true,
    workExperience: '',
    tag: '',
    jobCategory: 'IT/개발',
    postingDeadline: getOneWeekLater(), // 일주일 뒤로 기본값 설정
    companyProfileCode: null, // 초기값 null
    skill: '',
    address: '',
  });
  const { API_HOST } = useApiHost();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }
    axios
      .get(`${API_HOST}/api/v1/company-profile-code`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        setFormData((prev) => ({
          ...prev,
          companyProfileCode: response.data, // API로부터 companyProfileCode 설정
        }));
        console.log("responseDATA!!!!!!!!!!!!!!!!!! : " + response.data);
      })
      .catch((err) => {
        console.error('Failed to fetch companyProfileCode:', err);
        setError('기업 프로필 정보를 가져오는 데 실패했습니다.');
      });

  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // FormData 객체 생성
      const formDataToSend = new FormData();

      // JSON 데이터를 FormData로 변환
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image") {
          formDataToSend.append("uploadFile", value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      await axios.post(`${API_HOST}/jobposting/register`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('채용 공고가 성공적으로 등록되었습니다.');
      navigate('/jobs');
    } catch (err) {
      console.error('Error during submission:', err);
      setError(err.response?.data?.message || '공고 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const addDays = (currentDeadline, daysToAdd) => {
    const currentDate = new Date(currentDeadline);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate.toISOString().slice(0, 16);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>채용 공고 등록</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="채용 공고 제목"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">상세 내용 *</Label>
            <QuillWrapper>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleQuillChange}
                modules={MODULES}
                placeholder="채용 공고의 상세 내용을 입력하세요"
              />
            </QuillWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recruitField">모집인원 *</Label>
            <Input
              id="recruitField"
              name="recruitField"
              type="number"
              value={formData.recruitField}
              onChange={handleChange}
              min="1"
              placeholder="숫자만 입력"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recruitJob">모집 직무 *</Label>
            <Input
              id="recruitJob"
              name="recruitJob"
              value={formData.recruitJob}
              onChange={handleChange}
              placeholder="모집 직무 입력"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="salary">급여</Label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="radio"
                id="salaryInput"
                name="salaryType"
                value="direct"
                checked={!formData.salary.includes('면접 후 결정')}
                onChange={() => setFormData(prev => ({ ...prev, salary: '' }))}
              />
              <label htmlFor="salaryInput">직접입력</label>
              <input
                type="radio"
                id="salaryNegotiable"
                name="salaryType"
                value="negotiable"
                checked={formData.salary === '면접 후 결정'}
                onChange={() => setFormData(prev => ({ ...prev, salary: '면접 후 결정' }))}
              />
              <label htmlFor="salaryNegotiable">면접 후 결정</label>
            </div>
            {!formData.salary.includes('면접 후 결정') && (
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="예) 3,500만원"
                style={{ marginTop: '10px' }}
              />
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="postingDeadline">공고마감일 *</Label>
            <Input
              id="postingDeadline"
              name="postingDeadline"
              type="datetime-local"
              value={formData.postingDeadline}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
            />
            <ButtonGroup>
              <DateButton
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  postingDeadline: addDays(prev.postingDeadline, 1)
                }))}
              >
                +1일
              </DateButton>
              <DateButton
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  postingDeadline: addDays(prev.postingDeadline, 3)
                }))}
              >
                +3일
              </DateButton>
              <DateButton
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  postingDeadline: addDays(prev.postingDeadline, 7)
                }))}
              >
                +7일
              </DateButton>
            </ButtonGroup>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="workExperience">경력 *</Label>
            <Input
              id="workExperience"
              name="workExperience"
              type="number"
              value={formData.workExperience}
              onChange={handleChange}
              min="0"
              placeholder="숫자만 입력" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="skill">보유스킬</Label>
            <Input
              id="skill"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              placeholder="예) React, JavaScript, Node.js (쉼표로 구분)"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="skills">근무지</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="실근무지를 기재해주세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">공고 이미지</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              style={{ marginTop: '10px' }}
            />
          </FormGroup>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '채용 공고 등록'}
          </Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    </>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const DateButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #f9fafb;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
`;

export default JobPosting;
