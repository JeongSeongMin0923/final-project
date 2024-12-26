package com.example.devjobs.user.filter;

import com.example.devjobs.user.entity.User;
import com.example.devjobs.user.provider.JwtProvider;
import com.example.devjobs.user.repository.UserRepository;
import com.example.devjobs.user.service.implement.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = parseBearerToken(request);
            if (token == null) {
                System.out.println("JWT 토큰이 누락되었습니다.");
                filterChain.doFilter(request, response);
                return;
            }

            Claims claims = jwtProvider.getClaims(token);
            if (claims == null) {
                System.out.println("JWT 검증 실패: " + token);
                filterChain.doFilter(request, response);
                return;
            }

            String userCode = claims.get("userCode", String.class);
            if (userCode == null || userCode.isEmpty()) {
                System.out.println("JWT에 userCode가 없습니다: " + token);
                filterChain.doFilter(request, response);
                return;
            }

            User user = userRepository.findByUserCode(userCode);
            if (user == null) {
                System.out.println("유효한 사용자 Code를 찾을 수 없습니다: " + userCode);
                filterChain.doFilter(request, response);
                return;
            }

            UserDetailsImpl userDetails = new UserDetailsImpl(user);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } catch (Exception e) {
            System.out.println("인증 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");

        if (!StringUtils.hasText(authorization)) {
            return null;
        }

        if (!authorization.startsWith("Bearer ")) {
            return null;
        }

        return authorization.substring(7); // Bearer 이후의 토큰 값 반환
    }
}