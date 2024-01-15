package com.ssudam.review.repository;

import com.ssudam.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMember_MemberId(long memberId);
}
