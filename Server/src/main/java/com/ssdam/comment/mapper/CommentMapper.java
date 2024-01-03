package com.ssdam.comment.mapper;

import com.ssdam.comment.dto.CommentDto;
import com.ssdam.comment.entity.Comment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment commentPostDtoToComment(CommentDto.Post requestBody);
    Comment commentPatchDtoToComment(CommentDto.Patch requestBody);
    CommentDto.Response commentToCommentResponse(Comment comment);
    List<CommentDto.Response> commentsToCommentResponses(List<Comment> comments);
}
