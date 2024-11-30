package com.pvzzombs.simplelogintodoapp.backend_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Users;

public interface UsersRepository extends JpaRepository<Users, String>{

}