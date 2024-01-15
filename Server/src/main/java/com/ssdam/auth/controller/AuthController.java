package com.ssdam.auth.controller;

import com.ssdam.auth.jwt.JwtTokenizer;
import com.ssdam.auth.utils.RedisUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final JwtTokenizer jwtTokenizer;
    private final RedisUtil redisUtil;

    public AuthController(JwtTokenizer jwtTokenizer, RedisUtil redisUtil) {
        this.jwtTokenizer = jwtTokenizer;
        this.redisUtil = redisUtil;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7);

            if (jwtTokenizer.validateToken(accessToken) && !redisUtil.hasKeyBlackList(accessToken)) {
                redisUtil.setBlackList(accessToken, "invalid", jwtTokenizer.getAccessTokenExpirationMinutes() * 60 * 1000L);
                return ResponseEntity.ok("로그아웃이 성공적으로 처리되었습니다.");
            } else {
                return ResponseEntity.ok("이미 로그아웃된 토큰이거나 유효하지 않은 토큰입니다.");
            }
        } else {
            return ResponseEntity.badRequest().body("올바른 토큰이 제공되지 않았습니다.");
        }
    }

}
