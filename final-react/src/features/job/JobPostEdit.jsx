import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useApiHost } from '../../context/ApiHostContext';

const JobPostEdit = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recruitJob: '',
    recruitField: 3,
    salary: '',
    postingStatus: true,
    workExperience: '',
    tag: '',
    jobCategory: 'IT/개발',
    postingDeadline: '',
    companyProfileCode: 6,
    skill: '',
    address: ''
  });
  const { API_HOST } = useApiHost();

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_HOST}/jobposting/read?no=${code}`);
        setFormData(response.data);
      } catch (err) {
        setError('채용공고를 불러오는데 실패했습니다.');
      }
    };
    fetchJob();
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.patch(
        `${API_HOST}/jobposting/modify`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      navigate(`/jobs/${code}`);
    } catch (err) {
      setError(err.response?.data?.message || '수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuillChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>채용 공고 수정</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>제목 *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>상세내용 *</Label>
            <QuillWrapper>
              <ReactQuill
                value={formData.content}
                onChange={handleQuillChange}
              />
            </QuillWrapper>
          </FormGroup>

          <FormGroup>
            <Label>모집 인원 *</Label>
            <Input
              name="recruitJob"
              value={formData.recruitField}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>모집 직무 *</Label>
            <Input
              id="recruitJob"
              name="recruitJob"
              value={formData.recruitJob}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>급여</Label>
            <Input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label
              htmlFor="postingDeadline">공고마감일 *</Label>
            <Input
              id="postingDeadline"
              name="postingDeadline"
              type="datetime-local"
              value={formData.postingDeadline}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
            />
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
            <Label>기술스택</Label>
            <Input
              name="skill"
              value={formData.skill}
              onChange={handleChange}
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

          <ButtonGroup>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정하기'}
            </SubmitButton>
            <CancelButton type="button" onClick={() => navigate(`/jobs/${code}`)}>
              취소
            </CancelButton>
          </ButtonGroup>
        </Form>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 950px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

const SubmitButton = styled(Button)`
  background: #3498db;
  color: white;
  border: none;
  &:hover {
    background: #2980b9;
  }
`;

const CancelButton = styled(Button)`
  background: #e74c3c;
  color: white;
  border: none;
  &:hover {
    background: #c0392b;
  }
`;

const ErrorMessage = styled.div`
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

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f2f5;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
`;

export default JobPostEdit;