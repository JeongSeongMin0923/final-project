import React, { useState } from 'react';
import ResumePosting from './features/resume/ResumePosting';
import ResumeRead from './features/resume/ResumeRead';
import ResumeEdit from './features/resume/ResumeEdit';
import { createResume, getResume, updateResume } from './mockApi';

const TestResume = () => {
  const [step, setStep] = useState('create');
  const [resumeId, setResumeId] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleCreate = async (data) => {
    try {
      const newResume = await createResume(data);
      console.log('Create 결과:', newResume);
      setResumeId(newResume.id);
      setStep('read');
    } catch (error) {
      console.error('이력서 생성 중 오류 발생:', error);
    }
  };

  const handleRead = async () => {
    try {
      const data = await getResume(resumeId);
      console.log('Read 결과:', data);
      setResumeData(data);
      setStep('update');
    } catch (error) {
      console.error('이력서 조회 중 오류 발생:', error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const updatedResume = await updateResume(resumeId, data);
      console.log('Update 결과:', updatedResume);
      setResumeData(updatedResume);
      setStep('final');
    } catch (error) {
      console.error('이력서 수정 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h1>이력서 CRUD 테스트</h1>
      {step === 'create' && (
        <>
          <h2>1단계: 이력서 생성 (Create)</h2>
          <ResumePosting onSubmit={handleCreate} />
        </>
      )}
      {step === 'read' && (
        <>
          <h2>2단계: 이력서 조회 (Read)</h2>
          <p>생성된 이력서 ID: {resumeId}</p>
          <ResumeRead resumeId={resumeId || ''} />
          <button onClick={handleRead}>다음 단계로 (Update)</button>
        </>
      )}
      {step === 'update' && (
        <>
          <h2>3단계: 이력서 수정 (Update)</h2>
          <ResumeEdit resumeId={resumeId || ''} initialData={resumeData} onSubmit={handleUpdate} />
        </>
      )}
      {step === 'final' && (
        <>
          <h2>테스트 완료</h2>
          <p>모든 CRUD 작업이 완료되었습니다.</p>
          <ResumeRead resumeId={resumeId || ''} />
          <button onClick={() => setStep('create')}>처음부터 다시 시작</button>
        </>
      )}
    </div>
  );
};

export default TestResume;
