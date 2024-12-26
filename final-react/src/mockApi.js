import axios from "axios";

// 고유 ID 생성 함수
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Error 메시지 상수
const ERROR_MESSAGES = {
  NOT_FOUND: '이력서를 찾을 수 없습니다.',
};

// 로컬 스토리지에서 모든 이력서 가져오기
const getResumes = () => {
  try {
    const resumes = localStorage.getItem('resumes');
    return resumes ? JSON.parse(resumes) : [];
  } catch (error) {
    console.error('로컬 스토리지 데이터를 파싱하는 중 오류가 발생했습니다.', error);
    return [];
  }
};

// 로컬 스토리지에 이력서 저장하기
const saveResumes = (resumes) => {
  localStorage.setItem('resumes', JSON.stringify(resumes));
};

// 지연 함수
const delay = (callback, time = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback());
      } catch (error) {
        reject(error);
      }
    }, time);
  });
};

// 이력서 생성
export const createResume = (resumeData) => {
  return delay(() => {
    const resumes = getResumes();
    const newResume = { ...resumeData, id: generateId() };
    resumes.push(newResume);
    saveResumes(resumes);
    return newResume;
  });
};

// 이력서 조회
export const getResume = (id) => {
  return delay(async () => {

    let resumes = null;
    // const resumes = getResumes(); // 수정 (스토리지x API 호출)

    const response = await axios.get(`http://localhost:8080/resume/list`, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ6enoiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM0MDg5NjYxLCJleHAiOjE3MzQwOTMyNjEsInVzZXJDb2RlIjoiZGV2X3p6eiJ9.bw5MqzPk41tmSu-_Ew7-Bra-hU-dW2UqYHhgVxYIY1s'
      }
    });

    if (response.status === 200) {
      resumes = response.data
    } else {
      throw new Error(`api error: ${response.status} ${response.statusText}`);
    }

    const resume = resumes.find((r) => r.id === id);
    if (resume) {
      return resume;
    } else {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }
  });
};

// 이력서 수정
export const updateResume = (id, updatedData) => {
  return delay(() => {
    const resumes = getResumes();
    const index = resumes.findIndex((r) => r.id === id);
    if (index !== -1) {
      resumes[index] = { ...resumes[index], ...updatedData };
      saveResumes(resumes);
      return resumes[index];
    } else {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }
  });
};

// 이력서 삭제
export const deleteResume = (id) => {
  return delay(() => {
    const resumes = getResumes();
    const index = resumes.findIndex((r) => r.id === id);
    if (index !== -1) {
      resumes.splice(index, 1);
      saveResumes(resumes);
      return { message: '이력서가 삭제되었습니다.' };
    } else {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }
  });
};

// 초기 Mock 데이터 설정 (테스트용)
if (!localStorage.getItem('resumes')) {
  saveResumes([
    { id: generateId(), name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  ]);
}