package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

// import com.goterl.lazysodium.interfaces.PwHash;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Users;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.LoginDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.UsersService;
// import com.pvzzombs.simplelogintodoapp.backend_java.sodium.SodiumLoader;
import com.pvzzombs.simplelogintodoapp.backend_java.util.Utils;

@RestController
public class Login {
  private final UsersService usersService;
  private final SessionsService sessionsService;
  // private SodiumJava sodium;
  private final Argon2 argon2;
  private final Logger logger; 

  public Login(UsersService usersService, SessionsService sessionsService) {
    this.usersService = usersService;
    this.sessionsService = sessionsService;
    // sodium = new SodiumJava();
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    this.logger = LoggerFactory.getLogger(Login.class);
    logger.info("Hey I am created...");
  }

  @PostMapping("/login")
  public SimpleResponse tryLogin(@RequestBody LoginDetails l) {
    SimpleResponse response = new SimpleResponse();
    if (l.getUsername() == "" || l.getPassword() == "") {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("Blank field");
      return response;
    }
    if (sessionsService.getSessionById(l.getUsername()) != null) {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("User already logged in");
      return response;
    }
    Users usr;
    logger.info("Username: " + l.getUsername());
    usr = usersService.getUserById(l.getUsername());
    if (usr != null) {
      if (argon2.verify(usr.getPassword(), l.getPassword())) {
        String newUUID = UUID.randomUUID().toString();
        // byte[] newUUIDHashBytes = new byte[PwHash.STR_BYTES];
        String newUUIDHashBytes = argon2.hash(2, 65536, 1, newUUID);
        if (newUUIDHashBytes.length() > 0) {
          String newUUIDHash = new String(newUUIDHashBytes);
          newUUIDHash = Utils.removeZeroesOnTheEnd(newUUIDHash);
          Sessions s = new Sessions();
          s.setUsername(l.getUsername());
          s.setSessionid(newUUIDHash);
          sessionsService.createSession(s);
          response.setStatus("success");
          response.setSessionid(newUUID);
          response.setMessage("User logged in successfully");
          return response;
        } else {
          response.setStatus("failed");
          response.setSessionid("");
          response.setMessage("Error hashing password");
          return response;
        }
      } else {
        logger.info("Password verifying failed");
      }
    }

    logger.info("Its possible usr is null, " + usr.getUsername());


    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Error");
    return response;
  }
}
