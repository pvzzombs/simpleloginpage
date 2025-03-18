package com.pvzzombs.simplelogintodoapp.backend_java.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// import com.goterl.lazysodium.SodiumJava;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import de.mkammerer.argon2.Argon2Factory.Argon2Types;

// import com.goterl.lazysodium.interfaces.PwHash;
import com.pvzzombs.simplelogintodoapp.backend_java.model.Users;
import com.pvzzombs.simplelogintodoapp.backend_java.requestDetails.RegisterDetails;
import com.pvzzombs.simplelogintodoapp.backend_java.responseDetails.SimpleResponse;
import com.pvzzombs.simplelogintodoapp.backend_java.service.UsersService;
// import com.pvzzombs.simplelogintodoapp.backend_java.sodium.SodiumLoader;
// import com.pvzzombs.simplelogintodoapp.backend_java.util.Utils;

@RestController
public class Register {
  private final UsersService usersService;
  // private SodiumJava sodium;
  private final Argon2 argon2;

  public Register(UsersService usersService) {
    this.usersService = usersService;
    this.argon2 = Argon2Factory.create(Argon2Types.ARGON2id);
    // sodium = new SodiumJava();
  }

  @PostMapping("/register")
  public SimpleResponse tryRegister(@RequestBody RegisterDetails r) {
    SimpleResponse response = new SimpleResponse();
    if (r.getUsername() == "" || r.getPassword() == "") {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("Blank field");
      return response;
    }
    // check if user already exists
    if (usersService.getUserById(r.getUsername()) != null) {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("User already exists");
      return response;
    }
    // user does not exists, regoister
    // byte[] passwordHashBytes = new byte[PwHash.STR_BYTES];
    // byte[] passwordBytes = r.getPassword().getBytes();
    String hash = argon2.hash(2, 65536, 1, r.getPassword());
    // int result = SodiumLoader.sodium.crypto_pwhash_str(passwordHashBytes, passwordBytes, r.getPassword().length(), PwHash.OPSLIMIT_INTERACTIVE, PwHash.MEMLIMIT_INTERACTIVE);
    if (hash.length() == 0) {
      response.setStatus("failed");
      response.setSessionid("");
      response.setMessage("Hashing password failed");
      return response;
    }
    // String passwordHash = new String(passwordHashBytes);
    // passwordHash = Utils.removeZeroesOnTheEnd(passwordHash);
    System.out.println(hash);
    Users user = new Users();
    user.setUsername(r.getUsername());
    user.setPassword(hash);
    usersService.createUser(user);
    response.setStatus("success");
    response.setSessionid("");
    response.setMessage("User registered successfully");
    return response;
  }
}
