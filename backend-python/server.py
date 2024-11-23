from typing import Annotated
import logging
import uuid
from fastapi import FastAPI, Depends
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

class Users(SQLModel, table=True):
  username: str = Field(primary_key=True)
  password: str

class Sessions(SQLModel, table=True):
  username: str = Field(primary_key=True)
  sessionid: str

sqliteFileName = "test.db"
sqliteURL = f"sqlite:///{sqliteFileName}"
# connectArgs = { "check_same_thread": False }
engine = create_engine(sqliteURL)

def createDBAndTables():
  SQLModel.metadata.create_all(engine)

# def getSession():
#   with Session(engine) as session:
#     yield session

# SessionDep = Annotated[Session, Depends(getSession)]

app = FastAPI()

@app.on_event("startup")
def onStartUp():
  createDBAndTables()

# @app.get("/")
# def root():
#   return {"message": nacl.pwhash.str(b"Hello World")}

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
  with Session(engine) as session:
    session.add(Users(username=r.username, password=passwordHash))
    session.commit()
  return { "status": "success" }

@app.post("/login")
def login(l: LoginDetails):
  if l.username == "" or l.password == "":
    return { "status": "failed" }
  logging.debug("Here---")
  with Session(engine) as session:
    statement = select(Sessions).where(Sessions.username == l.username)
    results = session.exec(statement)
    for u in results:
      return { "status": "failed", "message": "User already logged in" }
    statement = select(Users).where(Users.username == l.username)
    results = session.exec(statement)
    isMatch = False
    for u in results:
      logging.debug("User exists---")
      logging.debug(u.password)
      try:
        isMatch = nacl.pwhash.verify(u.password.encode(), l.password.encode())
      except:
        logging.debug("Did not match passwords")
        isMatch = False
      if isMatch:
        newUUID = str(uuid.uuid4())
        newUUIDHash = nacl.pwhash.str(newUUID.encode())
        session.add(Sessions(username=l.username, sessionid=newUUIDHash))
        session.commit()
        return { "status": "success", "sessionid": newUUIDHash }
  return { "status": "failed", "message": "Cannot login" }