package com.ssdam.exception;

import lombok.Getter;

public enum ExceptionCode {
    MEMBER_NOT_FOUND(404, "Member not found"),
    MEMBER_EXISTS(409, "Member exists"),
    PARTY_NOT_FOUND(404, "Party not found"),
    PARTY_CLOSED_ERROR(400, "Party recruitment is closed"),
    NOT_IMPLEMENTATION(501, "Not Implementation"),
    INVALID_MEMBER_STATUS(400, "Invalid member status"),
    SERVER_UNAVAILABLE(503, "Service Unavailable"),
    COMMENT_NOT_FOUND(404, "Comment not found"),
    COMMENT_NOT_ALLOWED(422, "Comment not allowed"),
    REPLY_NOT_FOUND(404, "Reply not found"),
    REPLY_NOT_ALLOWED(422, "Reply not allowed"),
    TODOLIST_NOT_FOUND(404, "TodoList not found"),
    REVIEW_NOT_FOUND(404, "Review not found");

    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}
