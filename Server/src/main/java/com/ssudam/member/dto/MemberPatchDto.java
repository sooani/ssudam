package com.ssudam.member.dto;

import com.ssudam.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
@AllArgsConstructor
public class MemberPatchDto {
    private long memberId;

    @NotBlank(message = "비밀번호는 필수 항목입니다.")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
            message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수 항목입니다.")
    private String confirmPassword;

    @NotBlank(message = "닉네임은 공백이 아니어야 합니다.")
    @Pattern(regexp = "^[a-zA-Z0-9가-힣]{2,12}$",
            message = "닉네임은 2~12글자 이내여야합니다.")
    private String nickname;

    private Member.MemberStatus memberStatus;

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }
}