import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequest, EmailCertificationRequest, EmailCheckRequest, SignInRequest, SignUpRequest} from "./request/auth";
import { CheckCertificationResponse, EmailCertificationResponse, IdCheckedResponse, EmailCheckResponse, SignInResponse, SignUpResponse} from "./response/auth";
import { Response } from "./response";
import idCheckedRequest from "./request/auth/id-check.request";

const responsehandler = <T>(response: AxiosResponse<any, any>) => {
  const responseBody: T = response.data;
  return responseBody;
};

const errorHandler = (error:any) => {
  if(!error.response || !error.response.data) return null;
  const responseBody : Response = error.response.data;
  return responseBody;
}

const isLocalhost = window.location.hostname === 'localhost';
const DOMAIN = isLocalhost ? 'http://localhost:8080' : '/api';
const API_DOMAIN = `${DOMAIN}/api/v1`;

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CHECK_API_URL = () => `${API_DOMAIN}/auth/email-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

export const signInRequest = async (requestBody : SignInRequest) => {
  const result = await axios.post(SIGN_IN_URL(), requestBody)
      .then(responsehandler<SignInResponse>)
      .catch(errorHandler);

  return result;
}


export const signUpRequest = async (requestBody: SignUpRequest) => {
  const result = await axios.post(SIGN_UP_URL(), requestBody)
      .then(responsehandler<SignUpResponse>)
      .catch(errorHandler);

  return result;
}

export const idCheckRequest = async (requestBody: idCheckedRequest) => {

  const result = await axios.post(ID_CHECK_URL(), requestBody)
      .then(responsehandler<IdCheckedResponse>)
      .catch(errorHandler);
      
  return result;
  
};

export const emailCheckRequest = async (requestBody: EmailCheckRequest): Promise<EmailCheckResponse> => {
  try {
    const response = await axios.post<EmailCheckResponse>(EMAIL_CHECK_API_URL(), requestBody);
    return response.data;
  } catch (error) {
    console.error('이메일 중복 체크 요청 중 오류 발생:', error);
    // 오류 응답을 처리할 수 있도록 에러를 던집니다.
    throw error;
  }
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequest) => {
  const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
      .then(responsehandler<EmailCertificationResponse>)
      .catch(errorHandler);

      return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequest) => {
  const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
      .then(responsehandler<CheckCertificationResponse>)
      .catch(errorHandler);

      return result;
}; 
