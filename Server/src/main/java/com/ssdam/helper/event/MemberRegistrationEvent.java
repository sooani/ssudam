package com.ssdam.helper.event;

import com.ssdam.member.entity.Member;
import lombok.Getter;

@Getter
public class MemberRegistrationEvent {
    private Member member;

    public MemberRegistrationEvent(Member member) {
        this.member = member;
    }
}
