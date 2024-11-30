package com.pvzzombs.simplelogintodoapp.backend_java.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;
import com.pvzzombs.simplelogintodoapp.backend_java.repository.TodoRepository;

@Service
public class TodoService {
  private final TodoRepository todoRepository;

  public TodoService(TodoRepository todoRepository) {
    this.todoRepository = todoRepository;
  }

  public List<Todo> getTodoByUsername(String username) {
    return todoRepository.findByUsername(username);
  }

  public Todo getTodoByIdAndUSername(String id, String username) {
    return todoRepository.findByIdAndUsername(id, username).get();
  }

  public Todo createTodo(Todo todo) {
    return todoRepository.save(todo);
  }

  public Todo updateTodo(String id, String username, Todo todo) {
    Todo oldTodo = todoRepository.findByIdAndUsername(id, username).get();
    oldTodo.setItem(todo.getItem());
    oldTodo.setIsDone(todo.getIsDone());
    return todoRepository.save(oldTodo);
  }

  public void deleteByUsername(String username) {
    todoRepository.deleteByUsername(username);
  }
  
  public void deleteTodoByIdAndUsername(String id, String username) {
    todoRepository.deleteByIdAndUsername(id, username);
  }
}
