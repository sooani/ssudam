package com.ssudam.review.mapper;

import com.ssudam.review.dto.ReviewDto;
import com.ssudam.review.entity.Review;
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
