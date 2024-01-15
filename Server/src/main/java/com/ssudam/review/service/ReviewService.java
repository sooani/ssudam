package com.ssudam.review.service;

import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.review.entity.Review;
import com.ssudam.review.repository.ReviewRepository;
import com.ssudam.utils.CustomBeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final CustomBeanUtils<Review> beanUtils;

    public ReviewService(ReviewRepository reviewRepository, CustomBeanUtils<Review> beanUtils) {
        this.reviewRepository = reviewRepository;
        this.beanUtils = beanUtils;
    }

    // 후기 등록
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    // 후기 수정
    public Review updateReview(Review review) {
        Review foundReview = findReview(review.getReviewId());
        Review updatedReview = beanUtils.copyNonNullProperties(review, foundReview);

        return reviewRepository.save(updatedReview);
    }

    // 해당 멤버가 쓴 후기 조회
    @Transactional(readOnly = true)
    public Page<Review> findAllReviewsByMemberId(long memberId, int page, int size) {
        // 해당 멤버 ID에 대한 리뷰를 가져오는 리포지토리 메서드 호출
        List<Review> reviews = reviewRepository.findByMember_MemberId(memberId);
        Page<Review> pageReviews = new PageImpl<>(reviews, PageRequest.of(page, size, Sort.by("createdAt").descending()), reviews.size());

        return pageReviews;
    }

    // 전체 후기 조회
    public Page<Review> findAll(int page, int size) {
        return reviewRepository.findAll(PageRequest.of(page - 1, size, Sort.by("reviewId").descending()));
    }

    // 후기 삭제
    public void deleteReview(long reviewId) {
        Review foundReview = findReview(reviewId);
        reviewRepository.delete(foundReview);
    }

    @Transactional(readOnly = true)
    public Review findReview(long reviewId) {
        return reviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.REVIEW_NOT_FOUND));
    }
}
