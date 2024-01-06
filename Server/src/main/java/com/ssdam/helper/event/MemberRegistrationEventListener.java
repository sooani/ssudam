package com.ssdam.helper.event;


import com.ssdam.helper.email.EmailSender;
import com.ssdam.member.entity.Member;
import com.ssdam.member.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.MailSendException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

@Slf4j
@EnableAsync
@Component
public class MemberRegistrationEventListener {
    @Value("Thank you for joining our site!")
    private String subject;

    @Value("email-registration-member")
    private String templateName;

    private final EmailSender emailSender;
    private final MemberService memberService;

    public MemberRegistrationEventListener(EmailSender emailSender, MemberService memberService) {
        this.emailSender = emailSender;
        this.memberService = memberService;
    }

    @Async
    @EventListener
    public void listen(MemberRegistrationEvent event) throws Exception {
        try {
            String[] to = new String[]{event.getMember().getEmail()};
            String message = event.getMember().getEmail() + "님, 회원 가입이 성공적으로 완료되었습니다.";
            emailSender.sendEmail(to, subject, message, templateName);
        } catch (MailSendException e) {
            e.printStackTrace();
            log.error("MailSendException: rollback for Member Registration:");
            Member member = event.getMember();
            memberService.deleteMember(member.getMemberId());
        }
    }
}
