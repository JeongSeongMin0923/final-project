package com.example.devjobs.user.controller;

import com.example.devjobs.user.dto.UserDTO;
import com.example.devjobs.user.dto.request.auth.ChangePasswordRequest;
import com.example.devjobs.user.dto.request.auth.PasswordCheckRequest;
import com.example.devjobs.user.service.UserService;
import com.example.devjobs.user.service.implement.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody PasswordCheckRequest request,
                                           @AuthenticationPrincipal UserDetailsImpl userDetailsImpl) {
        // userDetailsImpl을 통해 현재 인증된 사용자의 정보를 가져온다.
        String userId = userDetailsImpl.getUser().getUserId();

        boolean isMatch = userService.checkUserPassword(userId, request.getPassword());
        if (isMatch) {
            return ResponseEntity.ok().body(Map.of("result", "success"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("result", "fail"));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자가 인증되지 않았습니다.");
        }

        String currentUserId = principal.getName();
        userService.updatePassword(currentUserId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("success", "비밀번호가 변경되었습니다."));
    }

    @PostMapping("/social-remove")
    public ResponseEntity<?> removeSocialUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "인증된 사용자 정보를 가져오지 못했습니다."));
        }

        try {
            String userCode = userDetails.getUser().getUserCode(); // 소셜 회원의 user_code 가져오기
            userService.deleteUserByCode(userCode); // userCode로 삭제
            return ResponseEntity.ok(Map.of("success", true, "message", "소셜 회원 탈퇴가 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "회원 탈퇴 중 오류가 발생했습니다.", "error", e.getMessage()));
        }
    }

    @GetMapping("/company-profile-code")
    public ResponseEntity<Integer> getCompanyProfileCode() {
        // SecurityContext에서 로그인된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Principal을 UserDetailsImpl로 변환
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userCode = userDetails.getUserCode(); // UserDetailsImpl에서 userCode가져옴

        Integer companyProfileCode = userService.getCompanyProfileCodeByUserCode(userCode);
        return ResponseEntity.ok(companyProfileCode);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
