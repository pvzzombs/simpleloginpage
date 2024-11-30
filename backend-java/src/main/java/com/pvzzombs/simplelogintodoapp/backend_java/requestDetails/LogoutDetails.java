package com.pvzzombs.simplelogintodoapp.backend_java.requestDetails;

public class LogoutDetails {
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
