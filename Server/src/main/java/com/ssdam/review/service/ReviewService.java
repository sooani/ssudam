package com.ssdam.review.service;

import com.ssdam.exception.BusinessLogicException;
import com.ssdam.exception.ExceptionCode;
import com.ssdam.review.entity.Review;
import com.ssdam.review.repository.ReviewRepository;
import com.ssdam.utils.CustomBeanUtils;
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

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public Review updateReview(Review review) {
        Review foundReview = findReview(review.getReviewId());
        Review updatedReview = beanUtils.copyNonNullProperties(review, foundReview);

        return reviewRepository.save(updatedReview);
    }

    public Page<Review> findAll(int page, int size) {
        return reviewRepository.findAll(PageRequest.of(page - 1, size, Sort.by("reviewId").descending()));
    }

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
