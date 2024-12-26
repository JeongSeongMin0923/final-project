export default interface SignUpRequest {
  userId: string;
  password: string;
  name: string;
  email: string;
  certificationNumber: string;
  type: string; // 일반회원(dev) 또는 기업회원(company)
  companyCode?: string; // 기업회원 전용
  companyType?: string; // 기업회원 전용
  companyName?: string; // 기업회원 전용
  ceoName?: string; // 기업회원 전용
  companyAddress?: string; // 기업회원 전용
  companyProfileCode?: number; // 기업회원 전용
}