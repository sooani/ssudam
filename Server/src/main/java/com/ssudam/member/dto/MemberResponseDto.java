package com.ssudam.member.dto;

import com.ssudam.member.entity.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class MemberResponseDto {
    private long memberId;
    private String email;
    private String nickname;
    private Member.MemberStatus memberStatus;

    public String getMemberStatus() {
        return memberStatus.getStatus();
    }
}
