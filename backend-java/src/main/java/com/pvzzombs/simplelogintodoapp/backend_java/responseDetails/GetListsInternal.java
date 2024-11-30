package com.pvzzombs.simplelogintodoapp.backend_java.responseDetails;

import java.util.List;

import com.pvzzombs.simplelogintodoapp.backend_java.model.Todo;

public class GetListsInternal {
  List<Todo> list;
  public List<Todo> getList() {
    return list;
  }
  public void setList(List<Todo> list) {
    this.list = list;
  }
}
