package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.UpdateListDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.TodoService;
// import com.pvzzombs.simplelogintodoapp.backend_java.sodium.SodiumLoader;

@RestController
public class UpdateList {
  private final SessionsService sessionsService;
  private final TodoService todoService;
  // private SodiumJava sodium;
  private final Argon2 argon2;

  public UpdateList(SessionsService sessionsService, TodoService todoService) {
    this.sessionsService = sessionsService;
    this.todoService = todoService;
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    // sodium = new SodiumJava();
  }

  @PostMapping("/list/update")
  public SimpleResponse tryUpdate(@RequestBody UpdateListDetails l) {
    SimpleResponse response = new SimpleResponse();
    if (l.getUsername() == "" || l.getSessionid() == "" || l.getItem() == "" || l.getId() == "" || l.getIsDone() == "") {
      response.setSessionid("");
      response.setStatus("failed");
      response.setMessage("Blank field");
      return response;
    }
    // check session
    Sessions s = sessionsService.getSessionById(l.getUsername());
    if (s != null) {
      if (argon2.verify(s.getSessionid(), l.getSessionid())) {
        Todo t = new Todo();
        t.setUsername(l.getUsername());
        t.setItem(l.getItem());
        t.setId(l.getId());
        t.setIsDone(l.getIsDone());
        todoService.updateTodo(l.getId(), l.getUsername(), t);
        response.setSessionid("");
        response.setStatus("success");
        response.setMessage("Update successful");
        return response;
      }
    }
    response.setSessionid("");
    response.setStatus("failed");
    response.setMessage("Update unsuccessful");
    return response;
  }
}
