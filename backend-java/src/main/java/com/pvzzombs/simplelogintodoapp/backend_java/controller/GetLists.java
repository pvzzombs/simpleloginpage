package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.GetListsDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.GetListsInternal;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.GetListsResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.TodoService;
// import com.pvzzombs.simplelogintodoapp.backend_java.sodium.SodiumLoader;

@RestController
public class GetLists {
  private final SessionsService sessionsService;
  private final TodoService todoService;
  private final Argon2 argon2;
  // private SodiumJava sodium;

  public GetLists(SessionsService sessionsService, TodoService todoService) {
    this.sessionsService = sessionsService;
    this.todoService = todoService;
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    // sodium = new SodiumJava();
  }

  @PostMapping("/list")
  public GetListsResponse tryGetLists(@RequestBody GetListsDetails g) {
    GetListsResponse response = new GetListsResponse();
    GetListsInternal internalData = new GetListsInternal();
    internalData.setList(new ArrayList<Todo>());
    if (g.getUsername() == "" || g.getSessionid() == "") {
      response.setStatus("failed");
      response.setData(internalData);
      response.setMessage("Blank field");
      return response;
    }
    // check session
    Sessions s = sessionsService.getSessionById(g.getUsername());
    if (s != null) {
      if (argon2.verify(s.getSessionid(), g.getSessionid())) {
        internalData.setList(todoService.getTodoByUsername(g.getUsername()));
        response.setData(internalData);
        response.setStatus("success");
        response.setMessage("List returned successfully");
        return response;
      }
    }
    response.setStatus("failed");
    response.setData(internalData);
    response.setMessage("Returning list unsuccessful");
    return response;
  }
}
