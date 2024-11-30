package com.pvzzombs.simplelogintodoapp.backend_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;

public interface SessionsRepository extends JpaRepository<Sessions, String>{
  
}
