package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.goterl.lazysodium.SodiumJava;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.LogoutDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;

@RestController
public class Logout {
  private final SessionsService sessionsService;
  private SodiumJava sodium;

  public Logout(SessionsService sessionsService) {
    this.sessionsService = sessionsService;
    sodium = new SodiumJava();
  }

  @PostMapping("/logout")
  public SimpleResponse tryLogout(@RequestBody LogoutDetails l) {
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
        sessionsService.deleteSession(l.getUsername());
        response.setStatus("success");
        response.setSessionid("");
        response.setMessage("Logout success");
        return response;
      }
    }
    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Logout unsuccesful");
    return response;
  }
}
