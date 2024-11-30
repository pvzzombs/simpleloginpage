package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.goterl.lazysodium.SodiumJava;
import com.goterl.lazysodium.interfaces.PwHash;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Sessions;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Users;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.LoginDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.SessionsService;
import com.pvzzombs.simplelogintodoapp.backend_java.service.UsersService;
import com.pvzzombs.simplelogintodoapp.backend_java.util.Utils;

@RestController
public class Login {
  private final UsersService usersService;
  private final SessionsService sessionsService;
  private SodiumJava sodium;

  public Login(UsersService usersService, SessionsService sessionsService) {
    this.usersService = usersService;
    this.sessionsService = sessionsService;
    sodium = new SodiumJava();
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
    usr = usersService.getUserById(l.getUsername());
    if (usr != null) {
      if (sodium.crypto_pwhash_str_verify(usr.getPassword().getBytes(), l.getPassword().getBytes(), l.getPassword().length()) == 0) {
        String newUUID = UUID.randomUUID().toString();
        byte[] newUUIDHashBytes = new byte[PwHash.STR_BYTES];
        if (sodium.crypto_pwhash_str(newUUIDHashBytes, newUUID.getBytes(), newUUID.length(), PwHash.OPSLIMIT_INTERACTIVE, PwHash.MEMLIMIT_INTERACTIVE) == 0) {
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
      }
    }
    response.setStatus("failed");
    response.setSessionid("");
    response.setMessage("Error");
    return response;
  }
}
