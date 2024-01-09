package com.ssdam.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@AllArgsConstructor
public class MemberPostDto {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank(message = "닉네임은 공백이 아니어야 합니다.")
    private String nickname;

}
