package com.pvzzombs.simplelogintodoapp.backend_java.requestDetails;

public class UpdateListDetails {
  private String username;
  private String sessionid;
  private String item;
  private String id;
  private String isDone;

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
  public String getItem() {
    return item;
  }
  public void setItem(String item) {
    this.item = item;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getIsDone() {
    return isDone;
  }
  public void setIsDone(String isDone) {
    this.isDone = isDone;
  }
}
