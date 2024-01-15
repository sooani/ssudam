package com.ssudam.todolist;

import com.ssudam.todolist.dto.TodoListDto;
import com.ssudam.todolist.entity.TodoList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TodoListStub {
    private static Map<HttpMethod, Object> stubRequestBody;
    static {
        stubRequestBody = new HashMap<>();
        stubRequestBody.put(HttpMethod.POST,
                new TodoListDto.Post("쓰레기 줍기", 1));
        stubRequestBody.put(HttpMethod.PUT,
                TodoListDto.Patch.builder()
                        .todolistId(1L).title("쓰레기 줍기").todoOrder(1).build());
    }

    public static Object getRequestBody(HttpMethod method) {
        return stubRequestBody.get(method);
    }

    public static TodoListDto.Response getSingleResponseBody() {
        return TodoListDto.Response.builder()
                .todolistId(1L)
                .title("쓰레기 줍기")
                .todoOrder(1)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
    }

    public static List<TodoListDto.Response> getMultiResponseBody() {
        TodoListDto.Response response1 = TodoListDto.Response.builder()
                .todolistId(1L)
                .title("쓰레기 줍기 1")
                .todoOrder(1)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        TodoListDto.Response response2 = TodoListDto.Response.builder()
                .todolistId(2L)
                .title("쓰레기 줍기 2")
                .todoOrder(3)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        TodoListDto.Response response3 = TodoListDto.Response.builder()
                .todolistId(1L)
                .title("쓰레기 줍기 3")
                .todoOrder(2)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();
        return List.of(response1, response2, response3);
    }

    public static Page<TodoList> getMultiTodoLists() {
        TodoList todo1 = new TodoList();
        todo1.setTodolistId(1L);
        todo1.setTitle("쓰레기 줍기 1");
        todo1.setTodoOrder(1);

        TodoList todo2 = new TodoList();
        todo2.setTodolistId(2L);
        todo2.setTitle("쓰레기 줍기 2");
        todo2.setTodoOrder(3);

        TodoList todo3 = new TodoList();
        todo3.setTodolistId(3L);
        todo3.setTitle("쓰레기 줍기 3");
        todo3.setTodoOrder(2);

        return new PageImpl<>(List.of(todo1, todo2, todo3),
                PageRequest.of(0, 3, Sort.by("todoOrder").ascending()), 3);
    }
}
