package com.ssdam.comment.dto;

import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

public class CommentDto {
    @Getter
    public static class Post {
        @Positive
        private long partyId;

        @Positive
        private long memberId;

        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String content;

    }

    @Getter
    public static class Patch {
        @Positive
        private long commentId;

        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String content;

        public void setCommentId(long commentId) {
            this.commentId = commentId;
        }
    }

    @Builder
    @Getter
    public static class Response {
        private long commentId;
        private long memberId;
        private String comment;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

}
