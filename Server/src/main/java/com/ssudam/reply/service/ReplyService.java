package com.ssudam.reply.service;

import com.ssudam.comment.entity.Comment;
import com.ssudam.comment.service.CommentService;
import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.reply.entity.Reply;
import com.ssudam.reply.repository.ReplyRepository;
import com.ssudam.utils.CustomBeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReplyService {
    private final ReplyRepository replyRepository;
    private final CommentService commentService;
    private final CustomBeanUtils<Reply> beanUtils;

    public ReplyService(ReplyRepository replyRepository, CommentService commentService, CustomBeanUtils<Reply> beanUtils) {
        this.replyRepository = replyRepository;
        this.commentService = commentService;
        this.beanUtils = beanUtils;
    }

    public Reply createReply(Reply reply){
        Comment comment = commentService.findComment(reply.getComment().getCommentId());
        findVerifiedMemberForReply(reply, comment);
        return replyRepository.save(reply);
    }

    public Reply updateReply(Reply reply){
        Reply foundReply = findVerifiedReply(reply.getReplyId());
        beanUtils.copyNonNullProperties(reply, foundReply);
        return replyRepository.save(foundReply);
    }
    @Transactional(readOnly = true)
    public Reply findReply(long replyId){
        return findVerifiedReply(replyId);
    }

    public void deleteReply(long replyId){
        replyRepository.delete(findVerifiedReply(replyId));
    }


    private static void findVerifiedMemberForReply(Reply reply, Comment comment) {
        if(reply.getMember().getMemberId()!= comment.getParty().getMember().getMemberId()){
            throw new BusinessLogicException(ExceptionCode.REPLY_NOT_ALLOWED);
        }
    }
    private Reply findVerifiedReply(long replyId) {
        return replyRepository.findById(replyId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.REPLY_NOT_FOUND));
    }
}
