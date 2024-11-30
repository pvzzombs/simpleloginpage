package com.pvzzombs.simplelogintodoapp.backend_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;
import java.util.List;
import java.util.Optional;


public interface TodoRepository extends JpaRepository<Todo, String> {
  List<Todo> findByUsername(String username);
  Optional<Todo> findByIdAndUsername(String id, String username);
  void deleteByUsername(String username);
  void deleteByIdAndUsername(String id, String username);
}
