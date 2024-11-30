package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.goterl.lazysodium.SodiumJava;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.DeleteAllListDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.TodoService;

@RestController
public class DeleteAllList {
  private final SessionsService sessionsService;
  private final TodoService todoService;
  private SodiumJava sodium;

  public DeleteAllList(SessionsService sessionsService, TodoService todoService) {
    this.sessionsService = sessionsService;
    this.todoService = todoService;
    sodium = new SodiumJava();
  }

  @PostMapping("/list/delete")
  public SimpleResponse tryDeleteAll(@RequestBody DeleteAllListDetails l) {
    SimpleResponse response = new SimpleResponse();
    if (l.getUsername() == "" || l.getSessionid() == "") {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("Blank field");
      return response;
    }
    Sessions s = sessionsService.getSessionById(l.getUsername());
    if (s != null) {
      if (sodium.crypto_pwhash_str_verify(s.getSessionid().getBytes(), l.getSessionid().getBytes(), l.getSessionid().length()) == 0) {
        todoService.deleteByUsername(l.getUsername());
        response.setStatus("success");
        response.setSessionid("");
        response.setMessage("Delete all successful");
        return response;
      }
    }
    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Delete all unsuccessful");
    return response;
  }
}
