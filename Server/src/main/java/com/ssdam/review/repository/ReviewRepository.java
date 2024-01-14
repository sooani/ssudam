package com.ssdam.review.repository;

import com.ssdam.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMember_MemberId(long memberId);
}
