import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContent";

const OAuthCallback = () => {
  const { name, type, email, userId, userCode, token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    console.log("OAuthCallback 데이터 수신:", { name, type, email, userId, userCode, token });

    if (!token || !userCode || !email || !name || !type) {
      console.error("필수 값 누락!");
      navigate("/error");
      return;
    }

    if (!alertShown) {
      try {
        // 로컬 스토리지 저장
        localStorage.setItem("token", token);
        // localStorage.setItem("expirationTime", expirationTime);
        localStorage.setItem("userCode", userCode);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        localStorage.setItem("type", type);

        // AuthContext 상태 업데이트
        login(name, type, email, userId, userCode, token);

        // 메시지는 처음 한 번만 출력
        alert(`${name} 님 로그인을 환영합니다!`);
        setAlertShown(true); // 메시지 출력 상태 업데이트

        console.log("데이터 저장 완료, 홈으로 이동");
        setTimeout(() => navigate("/"));
      } catch (error) {
        console.error("데이터 저장 중 오류 발생:", error);
        navigate("/error");
      }
    }
  }, [alertShown, login, navigate]); // 의존성 최소화

  // return (
  //   <div>
  //     <h2>로그인 처리 중...</h2>
  //   </div>
  // );
};

export default OAuthCallback;
