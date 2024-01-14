package com.ssdam.review.mapper;

import com.ssdam.review.dto.ReviewDto;
import com.ssdam.review.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReviewMapper {
    Review reiviewPostDtoToReview(ReviewDto.Post requestBody);
    Review reviewPatchDtoToReview(ReviewDto.Patch requestBody);
    ReviewDto.Response reviewToReviewResponseDto(Review review);
    List<ReviewDto.Response> reviewsToReviewResponseDtos(List<Review> reviews);
}
