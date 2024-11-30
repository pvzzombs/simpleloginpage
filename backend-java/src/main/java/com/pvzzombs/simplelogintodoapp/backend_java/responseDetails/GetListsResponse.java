package com.pvzzombs.simplelogintodoapp.backend_java.responseDetails;

public class GetListsResponse {
  private String status;
  private GetListsInternal data;
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
  public GetListsInternal getData() {
    return data;
  }
  public void setData(GetListsInternal data) {
    this.data = data;
  }
}
