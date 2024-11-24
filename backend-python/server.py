from typing import Annotated
import logging
import uuid
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import SQLModel, create_engine, Session, Field, select
import nacl.pwhash

logging.basicConfig(level=logging.DEBUG)

class LoginDetails(BaseModel):
  username: str
  password: str

class RegisterDetails(BaseModel):
  username: str
  password: str

class LogoutDetails(BaseModel):
  username: str
  sessionid: str

class ListDetails(BaseModel):
  username: str
  sessionid: str

class ListInsertDetails(BaseModel):
  username: str
  sessionid: str
  item: str
  id: str
  isDone: str

class ListUpdateDetails(BaseModel):
  username: str
  sessionid: str
  item: str
  id: str
  isDone: str

class ListDeleteOne(BaseModel):
  username: str
  sessionid: str
  id: str

class ListDeleteAll(BaseModel):
  username: str
  sessionid: str

class Users(SQLModel, table=True):
  username: str = Field(primary_key=True)
  password: str

class Sessions(SQLModel, table=True):
  username: str = Field(primary_key=True)
  sessionid: str

class Todo(SQLModel, table=True):
  username: str
  item: str
  id: str = Field(primary_key=True)
  isDone: str

sqliteFileName = "test.db"
sqliteURL = f"sqlite:///{sqliteFileName}"
# connectArgs = { "check_same_thread": False }
engine = create_engine(sqliteURL)

def createDBAndTables():
  SQLModel.metadata.create_all(engine)

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
def onStartUp():
  createDBAndTables()

# @app.get("/")
# def root():
#   return {"message": nacl.pwhash.str(b"Hello World")}

@app.post("/list/delete")
def deleteAllList(l: ListDeleteAll):
  if l.username == "" or l.sessionid == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        statement2 = select(Todo).where(Todo.username == l.username)
        results2 = session.exec(statement2)
        for r2 in results2:
          session.delete(r2)
          session.commit()
        return { "status": "success", "message": "All item deleted" }
  return { "status": "failed" }

@app.post("/list/deleteOne")
def deleteOneList(l: ListDeleteOne):
  if l.username == "" or l.sessionid == "" or l.id == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        statement2 = select(Todo).where(Todo.id == l.id).where(Todo.username == l.username)
        results2 = session.exec(statement2)
        for r2 in results2:
          session.delete(r2)
          session.commit()
        return { "status": "success", "message": "Item deleted" }
  return { "status": "failed" }

@app.post("/list/update")
def updateList(l: ListUpdateDetails):
  if l.username == "" or l.sessionid == "" or l.id == "" or l.item == "" or l.isDone == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        statement2 = select(Todo).where(Todo.id == l.id).where(Todo.username == l.username)
        results2 = session.exec(statement2)
        for r2 in results2:
          r2.item = l.item
          r2.isDone = l.isDone
        session.add(r2)
        session.commit()
        return { "status": "success", "message": "Item updated" }
  return { "status": "failed" }

@app.post("/list/insert")
def insertList(l: ListInsertDetails):
  if l.username == "" or l.sessionid == "" or l.id == "" or l.item == "" or l.isDone == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        session.add(Todo(username=l.username, item=l.item, id=l.id, isDone=l.isDone))
        session.commit()
        return { "status": "success", "message": "Item inserted" }
  return { "status": "failed" }

@app.post("/list")
def displayList(l: ListDetails):
  if l.username == "" or l.sessionid == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        statement2 = select(Todo).where(Todo.username == l.username)
        results2 = session.exec(statement2)
        todoList = []
        for r2 in results2:
          todoList.append({ "item": r2.item, "id": r2.id, "isDone": r2.isDone })
        return { "status": "success", "data": { "list": todoList} }
  return { "status": "failed" }

@app.post("/logout")
def logout(l: LogoutDetails):
  if l.username == "" or l.sessionid == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for r in results:
      isMatch = False
      try:
        isMatch = nacl.pwhash.verify(r.sessionid.encode(), l.sessionid.encode())
      except:
        isMatch = False
      if isMatch:
        session.delete(r)
        session.commit()
        return { "status": "success" }
  return { "status": "failed" }

@app.post("/register")
def register(r: RegisterDetails):
  # check if empty
  if r.username == "" or r.password == "":
    return { "status": "failed" }
  # check if username already exists
  with Session(engine) as session:
    statement = select(Users).where(Users.username == r.username)
    results = session.exec(statement)
    for u in results:
      return { "status": "failed", "message": "Username already exists" }
    passwordHash = nacl.pwhash.str(r.password.encode()).decode()
    session.add(Users(username=r.username, password=passwordHash))
    session.commit()
  return { "status": "success" }

@app.post("/login")
def login(l: LoginDetails):
  if l.username == "" or l.password == "":
    return { "status": "failed" }
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for u in results:
      return { "status": "failed", "message": "User already logged in" }
    statement = select(Users).where(Users.username == l.username)
    results = session.exec(statement)
    isMatch = False
    for u in results:
      try:
        isMatch = nacl.pwhash.verify(u.password.encode(), l.password.encode())
      except:
        isMatch = False
      if isMatch:
        newUUID = str(uuid.uuid4())
        newUUIDHash = nacl.pwhash.str(newUUID.encode()).decode()
        session.add(Sessions(username=l.username, sessionid=newUUIDHash))
        session.commit()
        return { "status": "success", "sessionid": newUUID }
  return { "status": "failed", "message": "Cannot login" }