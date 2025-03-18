package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.DeleteOneListDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.TodoService;
// import com.pvzzombs.simplelogintodoapp.backend_java.sodium.SodiumLoader;

@RestController
public class DeleteOneList {
  private final SessionsService sessionsService;
  private final TodoService todoService;
  private final Argon2 argon2;
  // private SodiumJava sodium;

  public DeleteOneList(SessionsService sessionsService, TodoService todoService) {
    this.sessionsService = sessionsService;
    this.todoService = todoService;
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    // sodium = new SodiumJava();
  }

  @PostMapping("/list/deleteOne")
  public SimpleResponse tryDeleteOne(@RequestBody DeleteOneListDetails l) {
    SimpleResponse response = new SimpleResponse();
    if (l.getUsername() == "" || l.getSessionid() == "" || l.getId() == "") {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("Blank field");
      return response;
    }
    Sessions s = sessionsService.getSessionById(l.getUsername());
    if (s != null) {
      if (argon2.verify(s.getSessionid(), l.getSessionid())) {
        todoService.deleteTodoByIdAndUsername(l.getId(), l.getUsername());
        response.setStatus("success");
        response.setSessionid("");
        response.setMessage("Delete successful");
        return response;
      }
    }
    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Delete unsuccessful");
    return response;
  }
}
