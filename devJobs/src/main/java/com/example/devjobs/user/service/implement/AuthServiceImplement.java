package com.example.devjobs.user.service.implement;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
import com.example.devjobs.user.common.CertificationNumber;
import com.example.devjobs.user.dto.request.auth.*;
import com.example.devjobs.user.dto.response.ResponseDto;
import com.example.devjobs.user.dto.response.auth.*;
import com.example.devjobs.user.entity.Certification;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.provider.EmailProvider;
import com.example.devjobs.user.provider.JwtProvider;
import com.example.devjobs.user.repository.CertificationRepository;
import com.example.devjobs.user.repository.UserRepository;
import com.example.devjobs.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService {

    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;
    private final JwtProvider jwtProvider;
    private final EmailProvider emailProvider;
    private final CompanyProfileRepository companyProfileRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto) {
        try {
            String userId = dto.getUserId();
            boolean isExistId = userRepository.existsByUserId(userId);

            if (isExistId) {
                return IdCheckResponseDto.duplicatedId();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IdCheckResponseDto.success();
    }

    @Override
    public ResponseEntity<? super EmailCheckResponseDto> emailCheck(EmailCheckRequestDto dto) {
        try {
            String email = dto.getEmail();
            boolean isExistEmail = userRepository.existsByEmail(email);

            if (isExistEmail) {
                return EmailCheckResponseDto.duplicatedEmail();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCheckResponseDto.success();
    }

    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        try {
            String userId = dto.getUserId();
            String email = dto.getEmail();

            boolean isExistId = userRepository.existsById(userId);
            if (isExistId) {
                return EmailCertificationResponseDto.duplicateId();
            }

            String certificationNumber = CertificationNumber.getCertificationNumber();

            boolean isSuccess = emailProvider.sendCertificationMail(email, certificationNumber);
            if (!isSuccess) {
                return EmailCertificationResponseDto.mailSendFail();
            }

            Certification certification = new Certification(userId, email, certificationNumber);
            certificationRepository.save(certification);
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto) {
        try {
            String userId = dto.getUserId();
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();

            Certification certification = certificationRepository.findByUserId(userId);
            if (certification == null) {
                return CheckCertificationResponseDto.certificationFail();
            }

            boolean isMatched = certification.getEmail().equals(email) &&
                    certification.getCertificationNumber().equals(certificationNumber);
            if (!isMatched) {
                return CheckCertificationResponseDto.certificationFail();
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CheckCertificationResponseDto.success();
    }

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        try {
            String userId = dto.getUserId();
            boolean isExistId = userRepository.existsById(userId);

            if (isExistId) {
                return SignUpResponseDto.duplicateId();
            }

            // 인증번호 확인 로직
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();
            Certification certification = certificationRepository.findByUserId(userId);

            if (certification == null || !certification.getEmail().equals(email) ||
                    !certification.getCertificationNumber().equals(certificationNumber)) {
                return SignUpResponseDto.certificationFail();
            }

            // 비밀번호 암호화
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            // 유저 생성 및 저장
            User user = new User(dto);
            userRepository.save(user);

            // 기업 회원인 경우 CompanyProfile 생성
            if ("company".equals(dto.getType())) {
                CompanyProfile companyProfile = new CompanyProfile(dto, user);
                companyProfileRepository.save(companyProfile);
            }

            // 인증 정보 삭제
            certificationRepository.deleteByUserId(userId);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Override
    public ResponseEntity<ResponseDto> signIn(SignInRequestDto dto) {
        try {
            String userId = dto.getUserId();
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return SignInResponseDto.signInFail(); // 로그인 실패 처리
            }

            String password = dto.getPassword();
            String encodedPassword = user.getPassword();

            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) {
                return SignInResponseDto.signInFail(); // 비밀번호 불일치 처리
            }

            String role = user.getRole();
            String userCode = user.getUserCode();
            String token = jwtProvider.create(userId, role, userCode);

            if ("company".equals(user.getType())) {
                // 기업 회원인 경우 CompanyProfile 조회
                CompanyProfile companyProfile = companyProfileRepository.findByUser(user);
                return ResponseEntity.ok(SignInResponseDto.companySuccess(token, user, companyProfile));
            } else {
                // 일반 회원
                return ResponseEntity.ok(SignInResponseDto.success(token, user));
            }

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDto.databaseError().getBody());
        }
    }

    @Override
    public UserInfoResponseDto getUserInfo(String token) {
        try {
            // 토큰에서 사용자 ID 추출
            String userId = jwtProvider.getUserIdFromToken(token.replace("Bearer ", ""));

            // 사용자 정보 조회
            User user = userRepository.findByUserId(userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // 회사 정보 조회
            CompanyProfile companyProfile = user.getCompanyProfile();

            // DTO 생성 및 반환
            return UserInfoResponseDto.fromUserAndCompany(user, companyProfile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user info", e);
        }
    }
}