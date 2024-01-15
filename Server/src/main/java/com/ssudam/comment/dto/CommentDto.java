package com.ssudam.comment.dto;

import com.ssudam.reply.dto.ReplyDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

public class CommentDto {
    @Getter
    @AllArgsConstructor
    public static class Post {
        @Positive
        private long partyId;
        @Positive
        private long memberId;
        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String comment;
    }

    @Getter
    @Builder
    public static class Patch {

        private long commentId;
        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String comment;

        public void setCommentId(long commentId) {
            this.commentId = commentId;
        }
    }

    @Builder
    @Getter
    public static class Response {
        private long commentId;
        private String partyTitle;
        private String nickname;
        private int likeCount;
        private String comment;
        private ReplyDto.Response reply;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

}
