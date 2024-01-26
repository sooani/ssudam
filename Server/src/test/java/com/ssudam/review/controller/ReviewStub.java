package com.ssudam.review.controller;

import com.ssudam.member.entity.Member;
import com.ssudam.review.dto.ReviewDto;
import com.ssudam.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReviewStub {
    private static Map<HttpMethod, Object> stubRequestBody;
    static {
        stubRequestBody = new HashMap<>();
        stubRequestBody.put(HttpMethod.POST,
                new ReviewDto.Post(1L, "쓰담 후기 1", "쓰담 후기 내용 1")
        );
        stubRequestBody.put(HttpMethod.PATCH,
                new ReviewDto.Patch(1L, "쓰담 후기 1", "쓰담 후기 내용 1")
        );
    }

    public static Object getRequestBody(HttpMethod method) {
        return stubRequestBody.get(method);
    }

    public static ReviewDto.Response getSingleResponseBody() {
        return ReviewDto.Response.builder()
                .reviewId(1L)
                .title("쓰담 후기 1")
                .content("쓰담 후기 내용 1")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
    }

    public static List<ReviewDto.Response> getMultiResponseBody() {
        ReviewDto.Response response1 = ReviewDto.Response.builder()
                .memberId(1L)
                .reviewId(1L)
                .title("쓰담 후기 1")
                .content("쓰담 후기 내용 1")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        ReviewDto.Response response2 = ReviewDto.Response.builder()
                .memberId(1L)
                .reviewId(2L)
                .title("쓰담 후기 2")
                .content("쓰담 후기 내용 2")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        ReviewDto.Response response3 = ReviewDto.Response.builder()
                .memberId(1L)
                .reviewId(3L)
                .title("쓰담 후기 3")
                .content("쓰담 후기 내용 3")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
        return List.of(response1, response2, response3);
    }

    public static Page<Review> getMultiReviews() {
        Member member = new Member();
        member.setMemberId(1L);

        Review review1 = new Review();
        review1.setMember(member);
        review1.setReviewId(1L);
        review1.setTitle("쓰담 후기 1");
        review1.setContent("쓰담 후기 내용 1");

        Review review2 = new Review();
        review2.setMember(member);
        review2.setReviewId(2L);
        review2.setTitle("쓰담 후기 2");
        review2.setContent("쓰담 후기 내용 2");

        Review review3 = new Review();
        review3.setMember(member);
        review3.setReviewId(3L);
        review3.setTitle("쓰담 후기 3");
        review3.setContent("쓰담 후기 내용 3");

        return new PageImpl<>(List.of(review1, review2, review3),
                PageRequest.of(0, 3, Sort.by("reviewId").descending()), 3);
    }
}
