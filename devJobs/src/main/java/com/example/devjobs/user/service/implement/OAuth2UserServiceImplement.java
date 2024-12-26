package com.example.devjobs.user.service.implement;

import com.example.devjobs.user.entity.CustomOAuth2User;
import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();

        String userCode = null;
        String name = null;
        String email = null;
        String type = null;

        // 카카오 로그인 처리
        if (oauthClientName.equals("kakao")) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");

            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
                Map<String, Object> properties = (Map<String, Object>) oAuth2User.getAttributes().get("properties");
                if (properties != null && properties.containsKey("nickname")) {
                    name = (String) properties.get("nickname");
                }
            }

            userCode = "kakao_" + oAuth2User.getAttributes().get("id");
            type = "kakao";
        }

        // 네이버 로그인 처리
        if (oauthClientName.equals("naver")) {
            Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes().get("response");
            userCode = "naver_" + responseMap.get("id").substring(0, 14);
            email = responseMap.get("email");
            name = responseMap.get("name");
            type = "naver";
        }

        // Step 1: 기존 유저 조회
        User existingUser = userRepository.findOptionalByUserCode(userCode)
                .orElse(null);

        if (existingUser == null) {
            // Step 2: 기존 유저가 없으면 새로 저장
            existingUser = new User(userCode, email, name, type);
            userRepository.save(existingUser);
        } else {
            // Step 3: 기존 유저 정보 업데이트 (필요 시)
            existingUser.setEmail(email);
            existingUser.setName(name);
            userRepository.save(existingUser);  // 업데이트된 정보 저장
        }

        // CustomOAuth2User 객체 생성하여 반환
        return new CustomOAuth2User(existingUser.getUserCode(), existingUser.getEmail(), existingUser.getName(), existingUser.getType());
    }
}
