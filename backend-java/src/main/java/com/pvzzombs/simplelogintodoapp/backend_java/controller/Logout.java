package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.LogoutDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;

@RestController
public class Logout {
  private final SessionsService sessionsService;
  // private SodiumJava sodium;
  private final Argon2 argon2;
  private final Logger logger;

  public Logout(SessionsService sessionsService) {
    this.sessionsService = sessionsService;
    // sodium = new SodiumJava();
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    this.logger = LoggerFactory.getLogger(Logout.class);
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
      if (argon2.verify(s.getSessionid(), l.getSessionid())) {
        sessionsService.deleteSession(l.getUsername());
        response.setStatus("success");
        response.setSessionid("");
        response.setMessage("Logout success");
        return response;
      }
    }

    logger.info("s is null?!");

    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Logout unsuccesful");
    return response;
  }
}
