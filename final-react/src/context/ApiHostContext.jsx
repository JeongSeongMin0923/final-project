// src/context/ApiHostContext.jsx
import { createContext, useContext } from "react";

// Context 생성
const ApiHostContext = createContext();

// Provider 컴포넌트
export const ApiHostProvider = ({ children }) => {
  const API_HOST = import.meta.env.VITE_API_HOST;

  return (
    <ApiHostContext.Provider value={{ API_HOST }}>
      {children}
    </ApiHostContext.Provider>
  );
};

// 쉽게 사용할 수 있도록 커스텀 훅 생성
export const useApiHost = () => {
  const context = useContext(ApiHostContext);
  if (!context) {
    throw new Error("useApiHost must be used within an ApiHostProvider");
  }
  return context;
};
