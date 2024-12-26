package com.example.devjobs.user.service.implement;

import com.example.devjobs.companyprofile.entity.CompanyProfile;
import com.example.devjobs.companyprofile.repository.CompanyProfileRepository;
import com.example.devjobs.user.dto.UserDTO;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.repository.UserRepository;
import com.example.devjobs.user.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyProfileRepository companyProfileRepository;
    private final EntityManager entityManager;

    // 공통 메서드: 사용자 조회 및 예외 처리
    private User findUserOrThrow(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
        return user;
    }

    @Transactional
    @Override
    public void deleteUserByCode(String userCode) {
        User user = userRepository.findByUserCode(userCode);
        if (user == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 기업 회원인 경우 관련 CompanyProfile 삭제
        if ("company".equals(user.getType())) {
            CompanyProfile companyProfile = companyProfileRepository.findByUser(user);
            if (companyProfile != null) {
                // 영속성 컨텍스트에 포함되지 않았을 경우 merge
                if (!entityManager.contains(companyProfile)) {
                    companyProfile = entityManager.merge(companyProfile);
                }
                companyProfileRepository.delete(companyProfile);
            }
        }

        userRepository.delete(user);
    }


    @Override
    public void updatePassword(String userId, String currentPassword, String newPassword) {
        User user = findUserOrThrow(userId);

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }

        // 새 비밀번호 설정 및 저장
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public boolean checkUserPassword(String userId, String password) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public CompanyProfile getUserCompanyProfile(String userCode) {
        User user = userRepository.findByUserCode(userCode);
        if (user == null) {
            throw new IllegalArgumentException("User not found for userCode: " + userCode);
        }

        // CompanyProfile 반환
        return user.getCompanyProfile();
    }

    @Override
    public Integer getCompanyProfileCodeByUserCode(String userCode) {
        User user = userRepository.findByUserCode(userCode);
        if(user == null || user.getCompanyProfile() == null) {
            throw new IllegalArgumentException("유효한 사용자 또는 기업 프로필이 없습니다.");
        }

        return user.getCompanyProfile().getCompanyProfileCode();
      }

    public User getUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole() // 확인 필요
                ))
                .collect(Collectors.toList());
    }
}
