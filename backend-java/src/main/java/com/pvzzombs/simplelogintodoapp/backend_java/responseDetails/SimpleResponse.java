package com.pvzzombs.simplelogintodoapp.backend_java.responseDetails;

public class SimpleResponse {
  private String status;
  private String sessionid;
  private String message;

  public String getStatus() {
    return status;
  }
  public void setStatus(String status) {
    this.status = status;
  }
  public String getMessage() {
    return message;
  }
  public void setMessage(String message) {
    this.message = message;
  }
  public String getSessionid() {
    return sessionid;
  }
  public void setSessionid(String sessionid) {
    this.sessionid = sessionid;
  }
}
