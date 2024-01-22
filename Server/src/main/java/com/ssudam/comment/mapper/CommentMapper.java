package com.ssudam.comment.mapper;

import com.ssudam.comment.dto.CommentDto;
import com.ssudam.comment.entity.Comment;
import com.ssudam.member.entity.Member;
import com.ssudam.party.entity.Party;
import com.ssudam.reply.dto.ReplyDto;
import com.ssudam.reply.mapper.ReplyMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {
    ReplyMapper replyMapper = ReplyMapper.create();

    default Comment commentPostDtoToComment(CommentDto.Post requestBody) {
        Member member = new Member();
        Party party = new Party();
        Comment comment = new Comment();

        member.setMemberId(requestBody.getMemberId());
        party.setPartyId(requestBody.getPartyId());
        comment.addMember(member);
        comment.addParty(party);
        comment.setComment(requestBody.getComment());
        return comment;
    }

    Comment commentPatchDtoToComment(CommentDto.Patch requestBody);

    default CommentDto.Response commentToCommentResponse(Comment comment) {
        ReplyDto.Response reply = replyMapper.replyToReplyResponse(comment.getReply());

        return CommentDto.Response.builder()
                .commentId(comment.getCommentId())
                .partyId(comment.getParty().getPartyId())
                .partyTitle(comment.getParty().getTitle())
                .nickname(comment.getMember().getNickname())
                .likeCount(comment.getLikeCount())
                .comment(comment.getComment())
                .reply(reply)
                .createdAt(comment.getCreatedAt())
                .modifiedAt(comment.getModifiedAt())
                .build();
    }

    List<CommentDto.Response> commentsToCommentResponses(List<Comment> comments);
}
