package com.ssudam.like.repository;

import com.ssudam.comment.entity.Comment;
import com.ssudam.like.entity.Like;
import com.ssudam.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByMemberAndComment(Member member, Comment comment);
    void deleteByMemberAndComment(Member member, Comment comment);
}
