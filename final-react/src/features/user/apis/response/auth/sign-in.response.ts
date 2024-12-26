import Response from "../response";

export default interface SignInResponse extends Response {

  token : string;
  expirationTime : number;
  userId? : string;
  userCode : string;
  type : string;
  name : string;
  email : string;

  // 기업 회원 데이터
  companyCode?: string; // 사업자 등록번호
  companyType?: string; // 기업 형태 (중소기업, 대기업 등)
  companyName?: string; // 회사 이름
  ceoName?: string; // 대표 이름
  companyAddress?: string; // 회사 주소
  companyProfileCode?: number;
}