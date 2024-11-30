package com.pvzzombs.simplelogintodoapp.backend_java.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "todo")
public class Todo {
  private String username;
  private String item;
  @Id
  private String id;
  private String isDone;
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
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
    this. id = id;
  }
  public String getIsDone() {
    return isDone;
  }
  public void setIsDone(String isDone) {
    this.isDone = isDone;
  }
}
