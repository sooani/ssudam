package com.ssdam.todolist.mapper;

import com.ssdam.todolist.dto.TodoListDto;
import com.ssdam.todolist.entity.TodoList;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TodoListMapper {
    TodoList todoPostDtoToTodoList(TodoListDto.Post requestBody);
    TodoList todoPatchDtoToTodoList(TodoListDto.Patch requestBody);

    TodoListDto.Response todoToTodoListResponseDto(TodoList todoList);
    List<TodoListDto.Response> todosToTodoResponseDtos(List<TodoList> todos);
}
