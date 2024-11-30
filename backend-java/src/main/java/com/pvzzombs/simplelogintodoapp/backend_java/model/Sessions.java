package com.pvzzombs.simplelogintodoapp.backend_java.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions")
public class Sessions {
  @Id
  private String username;
  private String sessionid;
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getSessionid() {
    return sessionid;
  }
  public void setSessionid(String sessionid) {
    this.sessionid = sessionid;
  }
}
