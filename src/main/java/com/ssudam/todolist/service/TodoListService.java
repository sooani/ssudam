package com.ssudam.todolist.service;

import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.todolist.entity.TodoList;
import com.ssudam.todolist.repository.TodoListRepository;
import com.ssudam.utils.CustomBeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class TodoListService {
    private final TodoListRepository todoListRepository;
    private final CustomBeanUtils<TodoList> beanUtils;

    public TodoListService(TodoListRepository todoListRepository, CustomBeanUtils beanUtils) {
        this.todoListRepository = todoListRepository;
        this.beanUtils = beanUtils;
    }

    public TodoList createTodoList(TodoList todoList) {
        return todoListRepository.save(todoList);
    }

    public TodoList updateTodoList(TodoList todoList) {
        TodoList foundTodoList = findTodoList(todoList.getTodolistId());
        TodoList updatedTodoList = beanUtils.copyNonNullProperties(todoList, foundTodoList);

        return todoListRepository.save(updatedTodoList);
    }

    @Transactional(readOnly = true)
    public TodoList findTodoList(long todolistId) {
        return todoListRepository
                .findById(todolistId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.TODOLIST_NOT_FOUND));
    }

    public Page<TodoList> findAll(int page, int size) {
        return todoListRepository.findAll(PageRequest.of(page - 1, size, Sort.by("todoOrder").ascending()));
    }

    public void deleteTodo(long todolistId) {
        TodoList foundTodoList = findTodoList(todolistId);
        todoListRepository.delete(foundTodoList);
    }

    public void deleteAll() {
        todoListRepository.deleteAll();
    }
}
