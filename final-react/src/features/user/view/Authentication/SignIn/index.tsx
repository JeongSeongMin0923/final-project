import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../pages/AuthContent'; // AuthContext import
import InputBox from '../../../component/InputBox';
import { SignInRequest } from '../../../apis/request/auth';
import { signInRequest, SNS_SIGN_IN_URL } from '../../../apis';
import { SignInResponse } from '../../../apis/response/auth';
import { ResponseCode } from '../../../types/enums';
import { ResponseBody } from '../../../types';
import './style.css';
import { useCookies } from 'react-cookie';

export default function SignIn() {
  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [cookie, setCookie] = useCookies();

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const { login } = useAuth(); // AuthContext의 login 함수 가져오기
  const navigate = useNavigate();

  const signInResponse = (responseBody) => {
    if (!responseBody) return;
  
    const { code } = responseBody;
    if (code === ResponseCode.SUCCESS) {
      const {
        token,
        expirationTime,
        userId,
        userCode,
        type,
        name,
        email,
        companyCode,
        companyType,
        companyName,
        ceoName,
        companyAddress,
        companyProfileCode,
      } = responseBody;
  
      if (!token) {
        console.error("응답에 토큰이 없습니다.", responseBody);
        alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      const companyData = {
        companyCode,
        companyType,
        companyName,
        ceoName,
        companyAddress,
        companyProfileCode,
      };
      
      console.log("로그인 전송 데이터:", { name, type, email, userId, userCode, token, companyData });

      login(name, type, email, userId, userCode, token, type === "company" ? companyData : null);
  
      // JWT 토큰 저장
      const expires = new Date(new Date().getTime() + expirationTime * 1000);
      setCookie("accessToken", token, { expires, path: "/" });
  
      navigate("/"); // 로그인 후 홈으로 리디렉션
    } else {
      alert("아이디나 비밀번호가 틀렸습니다.");
    }
  };
  
  
  
  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserId(value);
    setMessage('');
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setMessage('');
  };

  const onSignInButtonClickHandler = () => {
    if (!userId || !password) {
      alert('아이디와 비밀번호 모두 입력하세요.');
      return;
    }

    const requestBody: SignInRequest = { userId, password };
    signInRequest(requestBody).then(signInResponse);
  };

  const onGeneralSignUpClickHandler = () => {
    navigate('/auth/sign-up?type=general'); // 일반회원가입 페이지로 이동
  };

  const onCompanySignUpClickHandler = () => {
    navigate('/auth/sign-up?type=company'); // 기업회원가입 페이지로 이동
  };

  const onSnsSignInButtonClickHandler = (type: 'kakao' | 'naver') => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSignInButtonClickHandler();
  };

  return (
    <div id="sign-in-wrapper">
      <div className="sign-in-image"></div>
      <div className="sign-in-container">
        <div className="sign-in-box">
          <div className="sign-in-title">{'DEVjOBS 로그인'}</div>
          <div className="sign-in-content-box">
            <div className="sign-in-content-input-box">
              <InputBox
                ref={idRef}
                title="아이디"
                placeholder="아이디를 입력해주세요"
                type="text"
                value={userId}
                onChange={onIdChangeHandler}
                onKeyDown={onIdKeyDownHandler}
              />
              <InputBox
                ref={passwordRef}
                title="비밀번호"
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                onChange={onPasswordChangeHandler}
                isErrorMessage
                message={message}
                onKeyDown={onPasswordKeyDownHandler}
              />
            </div>
            <div className="sign-in-content-button-box">
              <div className="primary-button-lg full-width" onClick={onSignInButtonClickHandler}>
                {'로그인'}
              </div>
              <div className='sign-in-content-text-link-box'>
                <div className="text-link-lg full-width" onClick={onGeneralSignUpClickHandler}>
                  {'일반회원가입'}
                </div>
                <div className="text-link-lg full-width" onClick={onCompanySignUpClickHandler}>
                  {'기업회원가입'}
                </div>
              </div>
            </div>
            <div className="sign-in-content-divider"></div>
            <div className="sign-in-content-sns-sign-in-box">
              <div className="sign-in-content-sns-sign-in-title">{'SNS 로그인'}</div>
              <div className="sign-in-content-sns-sign-in-button-box">
                <div className="kakao-sign-in-button" onClick={() => onSnsSignInButtonClickHandler('kakao')}></div>
                <div className="naver-sign-in-button" onClick={() => onSnsSignInButtonClickHandler('naver')}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}