package com.pvzzombs.simplelogintodoapp.backend_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;


public interface TodoRepository extends JpaRepository<Todo, String> {
  List<Todo> findByUsername(String username);
  Optional<Todo> findByIdAndUsername(String id, String username);
  @Modifying
  @Transactional
  @Query("delete from Todo where username = :u")
  void deleteByUsername(@Param("u") String username);
  @Modifying
  @Transactional
  @Query("delete from Todo where id = :i and username = :u")
  void deleteByIdAndUsername(@Param("i") String id, @Param("u") String username);
}
