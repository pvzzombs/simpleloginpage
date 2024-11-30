package com.pvzzombs.simplelogintodoapp.backend_java.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Users;
import com.pvzzombs.simplelogintodoapp.backend_java.repository.UsersRepository;

@Service
public class UsersService {
  private final UsersRepository usersRepository;

  public UsersService(UsersRepository usersRepository) {
    this.usersRepository = usersRepository;
  }

  public List<Users> getAllUsers() {
    return usersRepository.findAll();
  }

  public Users getUserById(String id) {
    Optional<Users> usr = usersRepository.findById(id);
    if (usr.isPresent()) {
      return usr.get();
    }
    return null;
  }

  public Users createUser(Users user) {
    return usersRepository.save(user);
  }

  public Users updateUser(String id, Users newUser) {
    Users oldUser = getUserById(id);
    oldUser.setUsername(newUser.getUsername());
    oldUser.setPassword(newUser.getPassword());
    return usersRepository.save(oldUser);
  }

  public void deleteUser(String id) {
    usersRepository.deleteById(id);
  }
}
