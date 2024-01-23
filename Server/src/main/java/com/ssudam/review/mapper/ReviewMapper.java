package com.ssudam.review.mapper;

import com.ssudam.member.entity.Member;
import com.ssudam.review.dto.ReviewDto;
import com.ssudam.review.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {
    default Review reviewPostDtoToReview(ReviewDto.Post requestBody) {
        Member member = new Member();
        Review review = new Review();

        member.setMemberId(requestBody.getMemberId());
        review.setMember(member);
        review.setTitle(requestBody.getTitle());
        review.setContent(requestBody.getContent());
        return review;
    }

    Review reviewPatchDtoToReview(ReviewDto.Patch requestBody);
    @Mapping(target = "memberId", source = "member.memberId")
    ReviewDto.Response reviewToReviewResponseDto(Review review);
    List<ReviewDto.Response> reviewsToReviewResponseDtos(List<Review> reviews);
}
