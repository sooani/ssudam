package com.ssdam.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

public class ReviewDto {
    @Getter
    @AllArgsConstructor
    public static class Post {
        @Positive
        private long memberId;
        @NotBlank(message = "제목은 필수 입력 사항입니다.")
        private String title;
        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String content;

        public Post(long memberId) {
            this.memberId = memberId;
        }
    }

    @Getter
    public static class Patch {
        private long reviewId;
        @NotBlank(message = "제목은 필수 입력 사항입니다.")
        private String title;

        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String content;

        public void addReviewId(long reviewId) {
            this.reviewId = reviewId;
        }

    }

    @Getter
    @Builder
    public static class Response {
        private long reviewId;
        private String title;
        private String content;
        private String createdAt;
        private String modifiedAt;
    }
}
