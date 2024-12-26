import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <SectionTitle>DevJobs</SectionTitle>
          <Description>
            IT 업계 전문 채용 플랫폼으로,<br />
            기업과 인재를 연결하는 최적의 솔루션을 제공합니다.
          </Description>
          <div style={{ marginTop: '0.1rem', color: '#4a90e2', fontSize: '0.9rem', fontStyle: 'italic' }}>
            "혁신적인 기술로 당신의 꿈을 현실로 만드는 곳, DevJobs가 함께합니다."
          </div>
        </FooterSection>

        <FooterSection>
          <SectionTitle>연락처</SectionTitle>
          <ContactInfo>
            <div>서울특별시 강남구 테헤란로 123</div>
            <div>Email: contact@techrecruit.com</div>
            <div>Tel: 02-1234-5678</div>
            <div>대표: 심태훈</div>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © 2024 Tech Recruit | 개인정보처리방침 | 이용약관
      </Copyright>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 3rem 0 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;  // 1rem에서 0.5rem으로 축소
  color: #ffffff;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;  // 1rem에서 0.5rem으로 축소
`;

const Description = styled.p`
  color: #b3b3b3;
  line-height: 1.6;
  margin-top: 0;  // 상단 여백 제거
`;

const ContactInfo = styled.div`
  color: #b3b3b3;
  line-height: 1.8;
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #333;
  color: #808080;
  font-size: 0.9rem;
`;

export default Footer;