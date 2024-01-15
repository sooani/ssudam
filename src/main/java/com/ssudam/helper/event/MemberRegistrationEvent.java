package com.ssudam.helper.event;

import com.ssudam.member.entity.Member;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class MemberRegistrationEvent extends ApplicationEvent {
    private Member member;

    public MemberRegistrationEvent(Object source, Member member) {
        super(source);
        this.member = member;
    }
}
