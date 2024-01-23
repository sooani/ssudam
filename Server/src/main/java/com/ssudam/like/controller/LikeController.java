package com.ssudam.like.controller;

import com.ssudam.annotation.ParamRequest;
import com.ssudam.like.service.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Positive;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/likes")
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }
    @ParamRequest
    @PostMapping("/comments/{comment-id}")//현재 로그인한 회원이 좋아요/취소 할 수 있는기능 (토글)
    public ResponseEntity toggleLikeToComment(@PathVariable("comment-id") @Positive long commentId,
                                              @RequestParam @Positive long memberId) {//이부분 나중에 토큰으로 받아야함

        likeService.toggleLike(commentId, memberId);
        return ResponseEntity.ok().build();
    }
    @ParamRequest
    @GetMapping("/comments/{comment-id}/like-status")//현재 로그인한 회원이 좋아요를 눌렀는지 확인
    public ResponseEntity checkLikeStatus(@PathVariable("comment-id") @Positive long commentId,
                                          @RequestParam @Positive long memberId) {
        boolean isLiked = likeService.isCommentLikedByUser(commentId, memberId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isLiked", isLiked);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
