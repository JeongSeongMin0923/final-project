import InputBox from '../../../component/InputBox';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCertificationRequest, EmailCertificationRequest, EmailCheckRequest, idCheckedRequest, SignUpRequest } from '../../../apis/request/auth';
import { checkCertificationRequest, emailCertificationRequest, emailCheckRequest, idCheckRequest, signUpRequest, SNS_SIGN_IN_URL } from '../../../apis';
import { CheckCertificationResponse, EmailCertificationResponse, EmailCheckResponse, IdCheckedResponse, SignUpResponse } from '../../../apis/response/auth';
import { ResponseCode } from '../../../types/enums';
import { ResponseBody } from '../../../types';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';

declare global {
  interface Window {
    daum: any;
  }
}

export default function SignUp() { 

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    setIsCompany(type === 'company');
  }, [searchParams]);


  const idRef = useRef<HTMLInputElement | null> (null);
  const passwordRef = useRef<HTMLInputElement | null> (null);
  const passwordCheckRef = useRef<HTMLInputElement | null> (null);
  const nameRef = useRef<HTMLInputElement | null> (null);
  const emailRef = useRef<HTMLInputElement | null> (null);
  const certificationNumberRef = useRef<HTMLInputElement | null> (null);

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [certificationNumber, setCertificationNumber] = useState<string>('');

  const [isCompany, setIsCompany] = useState<boolean>(false);
  const [companyCode, setCompanyCode] = useState<string>('');
  const [companyType, setCompanyType] = useState<string>('대기업'); // 기본값 설정
  const [companyName, setCompanyName] = useState<string>('');
  const [ceoName, setCeoName] = useState<string>('');
  const [companyAddress, setCompanyAddress] = useState<string>('');

  // 주소 관련 state (회사회원일 경우)
  const [companyPostcode, setCompanyPostcode] = useState<string>('');
  const [companyRoadAddress, setCompanyRoadAddress] = useState<string>('');
  const [companyJibunAddress, setCompanyJibunAddress] = useState<string>('');
  const [companyDetailAddress, setCompanyDetailAddress] = useState<string>('');
  const [companyExtraAddress, setCompanyExtraAddress] = useState<string>('');

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
  const [isNameError, setNameError] = useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [nameMessage, setNameMessage] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isEmailCheck, setIsEmailCheck] = useState<boolean>(false); // 이메일 중복 체크 상태
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);

  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(false); // 이메일 중복 여부
  const [isEmailChecking, setIsEmailChecking] = useState<boolean>(false); // 이메일 중복 체크 중 여부

  const signUpButtonClass = userId && password && passwordCheck && name && email && certificationNumber && isIdCheck && isEmailCheck && isCertificationCheck ? 'primary-button-lg' : 'disable-button-lg';

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;
  const namePattern = /^[가-힣]{2,8}$/;

  const navigate = useNavigate();

  const idCheckResponse = (responseBody: ResponseBody<IdCheckedResponse>) => {
    if(!responseBody) return ;
    const { code } = responseBody;
    if(code === ResponseCode.VALIDATION_FAIL) alert('아이디를 입력하세요.');
    if(code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
    }
    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return ;

    setIdError(false);
    setIdMessage('사용 가능한 아이디 입니다.');
    setIdCheck(true);
  }

  const emailCheckResponse = (responseBody: ResponseBody<EmailCheckResponse>) => {
    if(!responseBody) return;
    const { code } = responseBody;

    if(code === ResponseCode.VALIDATION_FAIL) {
      alert('이메일을 입력하세요.');
      return;
    }
    if(code === ResponseCode.DUPLICATE_EMAIL) {
      setEmailError(true);
      setEmailMessage('이미 사용중인 이메일 입니다.');
      setIsEmailUnique(false);
      setIsEmailCheck(false);
      return;
    }
    if(code === ResponseCode.DATABASE_ERROR) {
      alert('데이터베이스 오류입니다.');
      return;
    }
    if(code !== ResponseCode.SUCCESS) return ;

    setEmailError(false);
    setEmailMessage('사용 가능한 이메일입니다.');
    setIsEmailUnique(true);
    setIsEmailCheck(true);
  }

  const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponse>) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if(code === ResponseCode.VALIDATION_FAIL) alert('아이디, 이메일, 닉네임 모두 입력하세요.');
    if(code === ResponseCode.MAIL_FAIL) alert('이메일 전송에 실패했습니다.');
    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return ;

    setEmailMessage('인증번호가 전송되었습니다.');
  };

  const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponse>) => {

    if(!responseBody) return;
    
    const { code } = responseBody;
    if(code === ResponseCode.VALIDATION_FAIL) alert('아이디, 닉네임, 이메일, 인증번호를 모두 입력하세요.');
    if(code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
    }
    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return ;

    setCertificationNumberError(false);
    setCertificationNumberMessage('인증번호가 확인되었습니다.');
    setCertificationCheck(true);
  }

  const signUpResponse = (responseBody: ResponseBody<SignUpResponse>) => {

    if(!responseBody) return;
    
    const { code } = responseBody;
    if(code === ResponseCode.VALIDATION_FAIL) {
      alert('모든 값을 입력하세요.')
    };
    
    if(code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
    }

    if(code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
    }

    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');

    if(code !== ResponseCode.SUCCESS) return ;

    navigate('/auth/sign-in');
  }

  // onChangeHandler
  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

    const {value} = event.target;
    setUserId(value);
    setIdMessage('');
    setIdCheck(false);

  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

    const {value} = event.target;
    setPassword(value);
    setPasswordMessage('');

  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

    const {value} = event.target;
    setPasswordCheck(value);
    setPasswordCheckMessage('');

  };

  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
    setNameMessage('');

    if (!namePattern.test(value)) {
        setNameError(true);
        setNameMessage('이름을 제대로 입력해주세요.');
    } else {
        setNameError(false);
    }
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

    const {value} = event.target;
    setEmail(value);
    setEmailMessage('');
    setIsEmailUnique(false);
    setIsEmailCheck(false);

  };

  const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

    const {value} = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage('');
    setCertificationCheck(false);

  };

  // onButtonClickHandler
  const onIdButtonClickHandler = () => {

    if(!userId) return;
    const requestBody: idCheckedRequest = { userId };
    
    idCheckRequest(requestBody).then(idCheckResponse);

  }

  const onEmailCheckHandler = async () => {
    if (!email) {
      setEmailError(true);
      setEmailMessage('이메일을 입력해주세요.');
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailError(true);
      setEmailMessage('유효한 이메일 형식이 아닙니다.');
      return;
    }

    setIsEmailChecking(true);
    try {
      const requestBody: EmailCheckRequest = { userId, email };
      const response = await emailCheckRequest(requestBody);
      emailCheckResponse(response);
    } catch (error) {
      console.error('이메일 중복 체크 중 오류:', error);
      setEmailError(true);
      setEmailMessage('중복된 이메일입니다.');
    } finally {
      setIsEmailChecking(false);
    }
  };

  const onEmailCertificationHandler = async () => {
    if (!isEmailUnique) {
      alert('이메일 중복 확인을 먼저 해주세요.');
      return;
    }

    try {
      const requestBody: EmailCertificationRequest = { userId, email };
      await emailCertificationRequest(requestBody);
      setEmailMessage('인증번호가 전송되었습니다.');
    } catch (error) {
      console.error('이메일 인증 중 오류:', error);
      alert('이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const onEmailButtonClickHandler = () => {
    if (isEmailUnique) {
      onEmailCertificationHandler();
    } else {
      onEmailCheckHandler();
    }
  };

  const onCertificationNumberButtonClickHandler = () => {

    if(!userId || !name || !email || !certificationNumber) return;

    const requestBody: CheckCertificationRequest = { userId, email, certificationNumber };
    checkCertificationRequest(requestBody).then(checkCertificationResponse).catch(err => {
      console.error('인증번호 확인 중 오류:', err);
    });

  }

  const onSignUpButtonClickHandler = () => {

    if(!userId || !password || !passwordCheck || !name ||!email || !certificationNumber) return;

    if(!isIdCheck) {
      alert('중복 확인은 필수입니다.');
      return;
    }

    if(!isEmailCheck) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    const checkedPassword = passwordPattern.test(password);
    if(!checkedPassword){
      setPasswordError(true);
      setPasswordMessage('영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요');
      return;
    }

    if(password !== passwordCheck) {
      setPasswordCheckError(true);
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if(!isCertificationCheck) {
      alert('이메일 인증은 필수입니다.');
      return;
    }

    const requestBody: SignUpRequest = {
      userId,
      password,
      name,
      email,
      certificationNumber,
      type: isCompany ? 'company' : 'dev',
      ...(isCompany && {
        companyCode,
        companyType,
        companyName,
        ceoName,
        companyAddress: `${companyPostcode} ${companyRoadAddress} ${companyExtraAddress} ${companyDetailAddress}`,
      }),
    };

    signUpRequest(requestBody)
    .then(signUpResponse)
    .catch((error) => {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    });

    alert('회원가입을 축하드립니다.')

  };

  const onSignInButtonClickHandler = () => {
    navigate('/auth/sign-in');
  }

  const onSnsSignInButtonClickHandler = (type : 'kakao' | 'naver') => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  // onKeyDownHandler
  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    onIdButtonClickHandler();
  }

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  }
  
  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!emailRef.current) return;
    emailRef.current.focus();
  }
  
  const onNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!nameRef.current) return;
    nameRef.current.focus();
  }

  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    onEmailButtonClickHandler();
  }

  const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    onCertificationNumberButtonClickHandler();
  }

  // 다음 주소 API 실행 함수
  const handleDaumPostcode = () => {
    if(!window.daum || !window.daum.Postcode) {
      alert('주소 검색 스크립트를 불러올 수 없습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data: any) {
        var roadAddr = data.roadAddress; 
        var extraRoadAddr = ''; 

        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraRoadAddr += data.bname;
        }

        if(data.buildingName !== '' && data.apartment === 'Y'){
            extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }

        if(extraRoadAddr !== ''){
            extraRoadAddr = ' (' + extraRoadAddr + ')';
        }

        setCompanyPostcode(data.zonecode);
        setCompanyRoadAddress(roadAddr);
        setCompanyJibunAddress(data.jibunAddress);
        setCompanyExtraAddress(extraRoadAddr);
        // 상세주소는 사용자가 별도로 입력하도록 유지
      }
    }).open();
  };

  return (
    <SignUpWrapper id='sign-up-wrapper'>
      <div className='sign-up-image'></div>
      <SignUpContainer className='sign-up-container'>
        <SignUpBox className='sign-up-box'>
          <SignUpTitle className='sign-up-title'>
            {!isCompany ? '개인 회원가입' : '기업 회원가입'}
          </SignUpTitle>
          <SignUpContentBox className='sign-up-content-box'>
            {!isCompany && (
              <>
                <SNSSignInBox className='sign-up-content-sns-sign-in-box'>
                  <SNSSignInTitle className='sign-up-content-sns-sign-in-title'>{'SNS 회원가입'}</SNSSignInTitle>
                  <SNSSignInButtonBox className='sign-up-content-sns-sign-in-button-box'>
                    <KakaoSignInButton className='kakao-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('kakao')}></KakaoSignInButton>
                    <NaverSignInButton className='naver-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('naver')}></NaverSignInButton>
                  </SNSSignInButtonBox>
                </SNSSignInBox>
                <Divider className='sign-up-content-divider'></Divider>
              </>
            )}

            <InputContainerBox className='sign-up-content-input-box'>
              <InputBox
                ref={idRef}
                title='아이디'
                placeholder='아이디를 입력해주세요'
                type='text'
                value={userId}
                onChange={onIdChangeHandler}
                isErrorMessage={isIdError}
                message={idMessage}
                buttonTitle='중복 확인'
                onButtonClick={onIdButtonClickHandler}
                onKeyDown={onIdKeyDownHandler}
              />
              <InputBox
                ref={passwordRef}
                title='비밀번호'
                placeholder='비밀번호를 입력해주세요'
                type='password'
                value={password}
                onChange={onPasswordChangeHandler}
                isErrorMessage={isPasswordError}
                message={passwordMessage}
                onKeyDown={onPasswordKeyDownHandler}
              />
              <InputBox
                ref={passwordCheckRef}
                title='비밀번호 확인'
                placeholder='비밀번호를 다시 입력해주세요'
                type='password'
                value={passwordCheck}
                onChange={onPasswordCheckChangeHandler}
                isErrorMessage={isPasswordCheckError}
                message={passwordCheckMessage}
                onKeyDown={onPasswordCheckKeyDownHandler}
              />
              <InputBox
                ref={nameRef}
                title='이름'
                placeholder='이름을 입력해주세요'
                type='text'
                value={name}
                onChange={onNameChangeHandler}
                isErrorMessage={isNameError}
                message={nameMessage}
                onKeyDown={onNameKeyDownHandler}
              />
              <InputBox
                ref={emailRef}
                title='이메일'
                placeholder='이메일 주소를 입력해주세요'
                type='text'
                value={email}
                onChange={onEmailChangeHandler}
                isErrorMessage={isEmailError}
                message={emailMessage}
                // 버튼은 이메일 중복 체크와 인증을 위한 버튼으로 변경
                buttonTitle={isEmailUnique ? '이메일 인증' : '이메일 중복 체크'}
                onButtonClick={isEmailUnique ? onEmailCertificationHandler : onEmailCheckHandler}
                onKeyDown={onEmailKeyDownHandler}
                disabled={isEmailChecking} // 이메일 중복 체크 진행 중일 때만 비활성화
              />
              {isEmailChecking && <LoadingSpinner />}
              {/* 인증번호 입력 필드 */}
              <InputBox
                ref={certificationNumberRef}
                title='인증번호'
                placeholder='인증번호 4자리를 입력해주세요'
                type='text'
                value={certificationNumber}
                onChange={onCertificationNumberChangeHandler}
                isErrorMessage={isCertificationNumberError}
                message={certificationNumberMessage}
                buttonTitle='인증 확인'
                onButtonClick={onCertificationNumberButtonClickHandler}
                onKeyDown={onCertificationNumberKeyDownHandler}
                disabled={!isEmailUnique} // 이메일 중복 체크가 완료되면 활성화
              />

              {isCompany && (
                <CompanySignUpBox className="company-sign-up-box">
                  <InputBox
                    title="사업자 등록번호"
                    placeholder="사업자 등록번호를 입력해주세요"
                    type="text"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value)}
                  />
                  <InputBoxWrapper className="input-box">
                    <InputBoxTitle className="input-box-title">기업 형태</InputBoxTitle>
                    <Select
                      className="input-box-select"
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                    >
                      <option>대기업</option>
                      <option>대기업 계열사·자회사</option>
                      <option>중소기업(300명이하)</option>
                      <option>중견기업(300명이상)</option>
                      <option>벤처기업</option>
                      <option>외국계(외국 투자기업)</option>
                      <option>외국계(외국 법인기업)</option>
                      <option>국내 공공기관·공기업</option>
                      <option>비영리단체·협회·교육재단</option>
                      <option>외국 기관·비영리기구·단체</option>
                    </Select>
                  </InputBoxWrapper>
                  <InputBox
                    title="회사 이름"
                    placeholder="회사 이름을 입력해주세요"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <InputBox
                    title="대표 이름"
                    placeholder="대표 이름을 입력해주세요"
                    type="text"
                    value={ceoName}
                    onChange={(e) => setCeoName(e.target.value)}
                  />
                  {/* 주소 찾기 버튼 */}
                  <InputBoxWrapper className="input-box">
                    <InputBoxTitle className="input-box-title">회사 주소 찾기</InputBoxTitle>
                    <AddressSearchButton className='input-box-button-address' onClick={handleDaumPostcode}>
                      우편번호 찾기<SearchIcon />
                    </AddressSearchButton>
                  </InputBoxWrapper>

                  <InputBox
                    title="우편번호"
                    placeholder="우편번호"
                    type="text"
                    value={companyPostcode}
                    onChange={(e) => setCompanyPostcode(e.target.value)}
                    readOnly={true}
                  />
                  <InputBox
                    title="도로명 주소"
                    placeholder="도로명주소"
                    type="text"
                    value={companyRoadAddress}
                    onChange={(e) => setCompanyRoadAddress(e.target.value)} 
                    readOnly={true}
                  />
                  <InputBox
                    title="지번 주소"
                    placeholder="지번주소"
                    type="text"
                    value={companyJibunAddress}
                    onChange={(e) => setCompanyJibunAddress(e.target.value)}
                    readOnly={true}
                  />
                  <InputBox
                    title="상세 주소"
                    placeholder="상세주소를 입력해주세요"
                    type="text"
                    value={companyDetailAddress}
                    onChange={(e) => setCompanyDetailAddress(e.target.value)}
                  />
                  <InputBox
                    title="참고항목"
                    placeholder="참고항목"
                    type="text"
                    value={companyExtraAddress}
                    onChange={(e) => setCompanyExtraAddress(e.target.value)}
                    readOnly={true}
                  />
                </CompanySignUpBox>
              )}
            </InputContainerBox>
            <ButtonBox className='sign-up-content-button-box'>
              <SignUpButton
                className={`${signUpButtonClass} full-width`}
                onClick={onSignUpButtonClickHandler}
              >
                {'회원가입'}
              </SignUpButton>
              <SignInLink
                className='text-link-lg full-width'
                onClick={onSignInButtonClickHandler}
              >
                {'로그인'}
              </SignInLink>
            </ButtonBox>
          </SignUpContentBox>
        </SignUpBox>
      </SignUpContainer>
    </SignUpWrapper>
  );
}

const SignUpWrapper = styled.div`
  display: flex;
  /* 기타 스타일 */
`;

const SignUpContainer = styled.div`
  /* 스타일 */
`;

const SignUpBox = styled.div`
  /* 스타일 */
`;

const SignUpTitle = styled.div`
  /* 스타일 */
`;

const SignUpContentBox = styled.div`
  /* 스타일 */
`;

const SNSSignInBox = styled.div`
  /* 스타일 */
`;

const SNSSignInTitle = styled.div`
  /* 스타일 */
`;

const SNSSignInButtonBox = styled.div`
  /* 스타일 */
`;

const KakaoSignInButton = styled.div`
  /* 스타일 */
`;

const NaverSignInButton = styled.div`
  /* 스타일 */
`;

const Divider = styled.div`
  /* 스타일 */
`;

const InputContainerBox = styled.div`
  /* 스타일 */
`;

const CompanySignUpBox = styled.div`
  /* 스타일 */
`;

const InputBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const InputBoxTitle = styled.div`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddressSearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  display: flex;
  align-items: center;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonBox = styled.div`
  /* 스타일 */
`;

const SignUpButton = styled.div`
  /* 스타일 */
  cursor: pointer;

  &.disable-button-lg {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &.primary-button-lg {
    background-color: #3498db;
    color: white;
  }
`;

const SignInLink = styled.div`
  /* 스타일 */
  cursor: pointer;
  color: #3498db;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-left: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;