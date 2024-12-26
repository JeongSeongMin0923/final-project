import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f2f5;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

export const Container = styled.div`
  max-width: 950px;
  margin: 40px auto;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const Title = styled.h1`
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
`;

export const Input = styled.input`
  padding: 12px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

export const Button = styled.button`
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

export const QuillWrapper = styled.div`
  .ql-editor {
    min-height: 200px;
    font-size: 16px;
  }
  .ql-container {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

// ..................................추가

export const DevSection = styled.div`
  display: flex;
  justify-content: space-between; /* 양 끝으로 배치 */
  align-items: center; /* 세로 정렬 */
  margin-bottom: 10px;
`;

export const AddButtonLarger = styled.button`
  background-color: #f3f7ff;
  color: #007aff;
  border: 1px solid #007aff;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #007aff;
    color: white;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  color: #e74c3c;
  border: none;
  font-size: 18px; /* X 표시 크기 */
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #c0392b;
  }
`;

export const FullWidthWrapper = styled.div`
  width: 100%; /* 부모 컨테이너의 너비를 채움 */
  padding: 0; /* 내부 여백 제거 */
  border: 1px solid #ccc; /* 기본 테두리 */
  border-radius: 8px; /* 둥근 모서리 */
  display: flex; /* 입력 필드와 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  background-color: #fff; /* 흰색 배경 */
  box-sizing: border-box; /* 패딩 포함 */
  transition: all 0.3s ease;
  margin-bottom: 10px;

  &:focus-within {
    border-color: #3498db; /* 포커스 시 테두리 색상 */
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2); /* 포커스 효과 */
  }

  input {
    flex: 1; /* 부모 너비를 채우도록 설정 */
    border: none; /* 내부 Input 테두리 제거 */
    padding: 12px; /* 내부 여백 */
    font-size: 16px;
    border-radius: 8px; /* Input의 모서리 둥글게 */
    box-sizing: border-box;

    &:focus {
      outline: none; /* 기본 포커스 제거 */
    }
  }
`;

export const DevWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 줄 간 간격 */
  width: 100%; /* 부모 컨테이너의 너비에 맞게 */
  padding: 10px; /* 내부 여백 */
  box-sizing: border-box;

  .row {
    display: flex;
    gap: 12px; /* 항목 간 간격 */
    align-items: center; /* 세로 정렬 */
    width: 100%; /* 부모 컨테이너의 너비에 맞게 */
    flex-wrap: nowrap; /* 항목들이 줄을 넘지 않도록 설정 */
  }

  input {
    flex: 1; /* 모든 항목의 크기를 균일하게 조정 */
    flex-shrink: 1; /* 공간이 부족하면 축소 */
    min-width: 80px; /* 최소 너비 */
    max-width: 150px; /* 최대 너비 */
    height: 34px; /* 높이 */
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      border-color: #007aff;
      outline: none;
    }
  }
`;

export const StyledButton = styled.button.attrs((props) => ({
  // primary 속성이 DOM에 전달되지 않도록 필터링
  primary: props.primary ? 'true' : undefined,
}))`
  background: ${(props) => (props.primary === 'true' ? 'blue' : 'gray')};
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
`;