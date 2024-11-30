package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.goterl.lazysodium.SodiumJava;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.DeleteOneListDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.TodoService;

@RestController
public class DeleteOneList {
  private final SessionsService sessionsService;
  private final TodoService todoService;
  private SodiumJava sodium;

  public DeleteOneList(SessionsService sessionsService, TodoService todoService) {
    this.sessionsService = sessionsService;
    this.todoService = todoService;
    sodium = new SodiumJava();
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
      if (sodium.crypto_pwhash_str_verify(s.getSessionid().getBytes(), l.getSessionid().getBytes(), l.getSessionid().length()) == 0) {
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
