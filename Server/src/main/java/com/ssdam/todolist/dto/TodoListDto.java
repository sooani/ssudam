package com.ssdam.todolist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class TodoListDto {
    @Getter
    @AllArgsConstructor
    public static class Post {
        @NotBlank
        private String title;
        @NotNull
        private Integer todo_order;
    }

    @Getter
    public static class Patch {
        private long todolist_id;
        private String title;
        private Integer todo_order;
        public void addTodoListId(long todolist_id) {
            this.todolist_id = todolist_id;
        }
    }

    @Getter
    @Builder
    public static class Response {
        private long todolist_id;
        private String title;
        private Integer todo_order;
        private String createdAt;
        private String modifiedAt;
    }
}
