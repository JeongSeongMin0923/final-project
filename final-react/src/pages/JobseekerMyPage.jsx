import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    name: null,
    userType: null,
    email: null,
    userId: null,
    userCode: null,
    companyCode: null,
    companyType: null,
    companyName: null,
    ceoName: null,
    companyAddress: null,
  });

  useEffect(() => {
    const name = localStorage.getItem("name");
    const userType = localStorage.getItem("type");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const userCode = localStorage.getItem("userCode") 
    const companyCode = localStorage.getItem("companyCode");
    const companyType = localStorage.getItem("companyType");
    const companyName = localStorage.getItem("companyName");
    const ceoName = localStorage.getItem("ceoName");
    const companyAddress = localStorage.getItem("companyAddress");

    setAuthState({
      name: name || null,
      userType: userType || null,
      email: email || null,
      userId: userId || null,
      userCode: userCode || null,
      companyCode: userType === "company" ? companyCode || null : null,
      companyType: userType === "company" ? companyType || null : null,
      companyName: userType === "company" ? companyName || null : null,
      ceoName: userType === "company" ? ceoName || null : null,
      companyAddress: userType === "company" ? companyAddress || null : null,
    });

  }, []);

  const login = (name, userType, email, userId, userCode, token, companyData = null) => {
    console.log("로그인 호출:", { name, userType, email, userId, userCode, token, companyData });

    localStorage.setItem("name", name);
    localStorage.setItem("type", userType);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userCode", userCode);
    localStorage.setItem("token", token);

    // 일반 로그인에서 메시지 출력
    if (userType !== "kakao" && userType !== "naver") {
      alert(`${name} 님이 로그인 하셨습니다.`);
    }

    if (userType === "company" && companyData) {
      console.log("회사 데이터 저장:", companyData);
      localStorage.setItem("companyCode", companyData.companyCode || "");
      localStorage.setItem("companyType", companyData.companyType || "");
      localStorage.setItem("companyName", companyData.companyName || "");
      localStorage.setItem("ceoName", companyData.ceoName || "");
      localStorage.setItem("companyAddress", companyData.companyAddress || "");
    }

    setAuthState({
      name,
      userType,
      email,
      userId,
      userCode,
      companyCode: userType === "company" ? companyData?.companyCode || null : null,
      companyType: userType === "company" ? companyData?.companyType || null : null,
      companyName: userType === "company" ? companyData?.companyName || null : null,
      ceoName: userType === "company" ? companyData?.ceoName || null : null,
      companyAddress: userType === "company" ? companyData?.companyAddress || null : null,
    });
  };

  const logout = () => {
    const { name } = authState; 
    alert(`${name}님이 로그아웃 하셨습니다.`);
    localStorage.clear();
    setAuthState({
      name: null,
      userType: null,
      email: null,
      userId: null,
      userCode: null,
      companyCode: null,
      companyType: null,
      companyName: null,
      ceoName: null,
      companyAddress: null,
    });
  };

  const cancelAccount = () => {
    localStorage.clear();
    setAuthState({
      name: null,
      userType: null,
      email: null,
      userId: null,
      userCode: null,
      companyCode: null,
      companyType: null,
      companyName: null,
      ceoName: null,
      companyAddress: null,
    });
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, cancelAccount }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);