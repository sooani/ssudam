package com.ssudam.review.dto;

import com.ssudam.dto.MemberIdExtractable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

public class ReviewDto {
    @AllArgsConstructor
    @Getter
    public static class Post implements MemberIdExtractable {
        @Positive
        private long memberId;
        @NotBlank(message = "제목은 필수 입력 사항입니다.")
        private String title;
        @NotBlank(message = "내용은 필수 입력 사항입니다.")
        private String content;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Patch {
        private long reviewId;

        private String title;

        private String content;
    }

    @Getter
    @Builder
    public static class Response {
        private long memberId;
        private long reviewId;
        private String title;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
