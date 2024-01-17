package com.ssudam.review.controller;

import com.ssudam.annotation.BodyRequest;
import com.ssudam.annotation.ReviewRequest;
import com.ssudam.dto.MultiResponseDto;
import com.ssudam.dto.SingleResponseDto;
import com.ssudam.review.dto.ReviewDto;
import com.ssudam.review.entity.Review;
import com.ssudam.review.mapper.ReviewMapper;
import com.ssudam.review.service.ReviewService;
import com.ssudam.utils.UriCreator;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/reviews")
@Validated
public class ReviewController {
    private final static String REVIEW_DEFAULT_URL = "/v1/reviews";
    private final ReviewService reviewService;
    private final ReviewMapper mapper;

    public ReviewController(ReviewService reviewService, ReviewMapper mapper) {
        this.reviewService = reviewService;
        this.mapper = mapper;
    }

    // 후기 등록
    @BodyRequest
    @PostMapping
    public ResponseEntity postReview(@RequestBody @Valid ReviewDto.Post requestBody) {
        Review review = mapper.reviewPostDtoToReview(requestBody);
        Review createdReview = reviewService.createReview(review);
        URI location = UriCreator.createUri(REVIEW_DEFAULT_URL, createdReview.getReviewId());

        return ResponseEntity.created(location).build();
    }

    // 후기 수정
    @ReviewRequest
    @PatchMapping("/{review-id}")
    public ResponseEntity patchReview(@PathVariable("review-id") @Positive long reviewId,
                                      @Valid @RequestBody ReviewDto.Patch requestBody) {
        requestBody.setReviewId(reviewId);
        Review review = mapper.reviewPatchDtoToReview(requestBody);
        Review updatedReview = reviewService.updateReview(review);

        return new ResponseEntity(
                new SingleResponseDto<>
                        (mapper.reviewToReviewResponseDto(updatedReview)), HttpStatus.OK);
    }

    // 특정 멤버 후기 조회
    @GetMapping("/{member-id}")
    public ResponseEntity getReviewsByMember(@PathVariable("member-id") @Positive long memberId,
                                             @Positive @RequestParam int page,
                                             @Positive @RequestParam int size) {
        Page<Review> pageReview
                = reviewService.findAllReviewsByMemberId(memberId, page - 1, size);
        List<Review> reviews = pageReview.getContent();

        return new ResponseEntity(
                new MultiResponseDto<>
                        (mapper.reviewsToReviewResponseDtos(reviews), pageReview), HttpStatus.OK);
    }

    // 전체 후기 조회
    @GetMapping
    public ResponseEntity getReviews(@Positive @RequestParam int page,
                                     @Positive @RequestParam int size) {
        Page<Review> pageReview = reviewService.findAll(page, size);
        List<Review> reviews = pageReview.getContent();

        return new ResponseEntity(
                new MultiResponseDto<>
                        (mapper.reviewsToReviewResponseDtos(reviews), pageReview), HttpStatus.OK);
    }

    // 후기 삭제
    @ReviewRequest
    @DeleteMapping("/{review-id}")
    public ResponseEntity deleteReview(@PathVariable("review-id") long reviewId) {
        reviewService.deleteReview(reviewId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


}
