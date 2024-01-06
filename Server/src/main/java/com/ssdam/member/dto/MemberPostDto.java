package com.ssdam.member.dto;

import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
public class MemberPostDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank(message = "비밀번호는 필수 항목입니다.")
    private String password1;

    @NotBlank(message = "비밀번호는 확인은 필수 항목입니다.")
    private String password2;

    @NotBlank(message = "닉네임은 공백이 아니어야 합니다.")
    private String nickname;
}
