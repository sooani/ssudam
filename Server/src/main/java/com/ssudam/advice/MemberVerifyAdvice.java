package com.ssudam.advice;

import com.ssudam.comment.service.CommentService;
import com.ssudam.dto.MemberIdExtractable;
import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.party.service.PartyService;
import com.ssudam.reply.service.ReplyService;
import com.ssudam.review.service.ReviewService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Aspect
@Component
public class MemberVerifyAdvice {
    private final CommentService commentService;
    private final PartyService partyService;
    private final ReplyService replyService;
    private final ReviewService reviewService;
    private final HttpServletRequest httpServletRequest;

    public MemberVerifyAdvice(CommentService commentService,
                              PartyService partyService,
                              ReplyService replyService,
                              ReviewService reviewService,
                              HttpServletRequest httpServletRequest) {
        this.commentService = commentService;
        this.partyService = partyService;
        this.replyService = replyService;
        this.reviewService = reviewService;
        this.httpServletRequest = httpServletRequest;
    }

    @Before("@annotation(com.ssudam.annotation.MemberRequest))")
    public void compareMemberIdFromMember(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long memberId = extractIdFromPathVariable(joinPoint.getArgs());
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.BodyRequest))")
    public void compareMemberIdFromBody(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long memberId = extractMemberIdFromBody(joinPoint.getArgs());
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.CommentRequest))")
    public void compareMemberIdFromCommentId(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long commentId = extractIdFromPathVariable(joinPoint.getArgs());
        long memberId = commentService.findComment(commentId).getMember().getMemberId();
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.PartyRequest))")
    public void compareMemberIdFromPartyId(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long partyId = extractIdFromPathVariable(joinPoint.getArgs());
        long memberId = partyService.findVerifiedParty(partyId).getMember().getMemberId();
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.ReplyRequest))")
    public void compareMemberIdFromReplyId(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long replyId = extractIdFromPathVariable(joinPoint.getArgs());
        long memberId = replyService.findReply(replyId).getMember().getMemberId();
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.ReviewRequest))")
    public void compareMemberIdFromReviewId(JoinPoint joinPoint) {
        int securityContextMemberId = extractMemberId();
        long reviewId = extractIdFromPathVariable(joinPoint.getArgs());
        long memberId = reviewService.findReview(reviewId).getMember().getMemberId();
        compareMemberId(memberId, securityContextMemberId);
    }

    @Before("@annotation(com.ssudam.annotation.ParamRequest))")
    public void compareMemberIdFromParam() {
        int securityContextMemberId = extractMemberId();
        String memberId = extractMemberIdFromURI(httpServletRequest);
        compareMemberId(Long.parseLong(memberId), securityContextMemberId);
    }


    private static void compareMemberId(long memberId, int securityContextMemberId) {
        if ((memberId != securityContextMemberId)) {
            throw new BusinessLogicException(ExceptionCode.FORBIDDEN_MEMBER);
        }
    }

    public int extractMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new BusinessLogicException(ExceptionCode.FORBIDDEN_MEMBER);
        }
        Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
        return (int) principal.get("memberId");
    }

    private long extractMemberIdFromBody(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof MemberIdExtractable) {
                return ((MemberIdExtractable) arg).getMemberId();
            }
        }
        throw new IllegalArgumentException("지원하지 않는 타입입니다.");
    }

    private long extractIdFromPathVariable(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof Long) {
                return (long) arg;
            }
        }
        // 다른 타입에 대한 처리
        throw new IllegalArgumentException("지원하지 않는 타입입니다.");
    }

    private String extractMemberIdFromURI(HttpServletRequest servletRequest) {
        return servletRequest.getParameter("memberId");
    }


}

