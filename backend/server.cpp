#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <string>
#include <sstream>
#include <unordered_map>

#include <httplib.h>
#include <json.hpp>
#include <sqlitewrapper.hpp>
#include <sodium.h>

namespace uuid
{
  static std::random_device rd;
  static std::mt19937 gen(rd());
  static std::uniform_int_distribution<> dis(0, 15);
  static std::uniform_int_distribution<> dis2(8, 11);

  std::string generate_uuid_v4()
  {
    std::stringstream ss;
    int i;
    ss << std::hex;
    for (i = 0; i < 8; i++)
    {
      ss << dis(gen);
    }
    ss << "-";
    for (i = 0; i < 4; i++)
    {
      ss << dis(gen);
    }
    ss << "-4";
    for (i = 0; i < 3; i++)
    {
      ss << dis(gen);
    }
    ss << "-";
    ss << dis2(gen);
    for (i = 0; i < 3; i++)
    {
      ss << dis(gen);
    }
    ss << "-";
    for (i = 0; i < 12; i++)
    {
      ss << dis(gen);
    };
    return ss.str();
  }
}

void allowCORS(httplib::Response &res) {
  res.set_header("Access-Control-Allow-Origin", "*");
  res.set_header("Allow", "GET, POST, HEAD, OPTIONS");
  res.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin, Authorization");
  res.set_header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, HEAD");
}

std::string hash_password(std::string password) {
  // password hash len
  char passwordHash[crypto_pwhash_STRBYTES];
  if (crypto_pwhash_str(passwordHash, password.c_str(), password.size(), crypto_pwhash_OPSLIMIT_INTERACTIVE, crypto_pwhash_MEMLIMIT_INTERACTIVE) != 0) {
    throw ;
  }
  return std::string(passwordHash);
}

bool verify_password(std::string password, std::string passwordHash) {
  return crypto_pwhash_str_verify(passwordHash.c_str(), password.c_str(), password.size()) == 0;
}

int main(void)
{
  using namespace httplib;

  if (sodium_init() < 0) {
    std::cout << "libsodium not working" << std::endl;
    return 1;
  }

  // std::string pwdhash = hash_password("abc");
  // std::cout << "Password hash of abc: " << pwdhash << std::endl;
  // std::cout << verify_password("abc", pwdhash) << std::endl;

  std::cout << "Preparing database..." << std::endl;
  Sqlite::SqliteConnection connection("test.db");

  Server svr;

  svr.Options("/list/delete", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/list/delete", [&](const Request &req, Response &res){
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string sessionID = j["sessionid"];
    
    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
      if (row.getString(0) == userName && verify_password(sessionID, row.getString(1))) {
        Sqlite::sqliteExecute(connection, "delete from todo where username = ?", userName);
        res.set_content("{\"status\":\"success\"}", "application/json");
        return;
      }
    }
    res.set_content("{\"status\":\"failed\"}", "application/json");
  });

  svr.Options("/list/deleteOne", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/list/deleteOne", [&](const Request &req, Response &res){
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string sessionID = j["sessionid"];
    std::string todoID = j["id"];

    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
      if (row.getString(0) == userName && verify_password(sessionID, row.getString(1))) {
        Sqlite::sqliteExecute(connection, "delete from todo where username = ? and id = ?", userName, todoID);
        res.set_content("{\"status\":\"success\"}", "application/json");
        return;
      }
    }
    res.set_content("{\"status\":\"failed\"}", "application/json");
  });

  svr.Options("/list/update", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/list/update", [&](const Request &req, Response &res){
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string sessionID = j["sessionid"];
    std::string todoID = j["id"];
    std::string todoIsDone = j["isDone"];

    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
      if (row.getString(0) == userName && verify_password(sessionID, row.getString(1))) {
        Sqlite::sqliteExecute(connection, "update todo set isDone = ? where id = ? and username = ?", todoIsDone, todoID, userName);
        res.set_content("{\"status\":\"success\"}", "application/json");
        return;
      }
    }
    res.set_content("{\"status\":\"failed\"}", "application/json");
  });

  svr.Options("/list/insert", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/list/insert", [&](const Request &req, Response &res){
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string sessionID = j["sessionid"];
    std::string todoItem = j["item"];
    std::string todoID = j["id"];
    std::string todoIsDone = j["isDone"];

    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
      if (row.getString(0) == userName && verify_password(sessionID, row.getString(1))) {
        Sqlite::sqliteExecute(connection, "insert into todo(username, item, id, isDone) values(?, ?, ?, ?)", userName, todoItem, todoID, todoIsDone);
        res.set_content("{\"status\":\"success\"}", "application/json");
        return;
      }
    }
    res.set_content("{\"status\":\"failed\"}", "application/json");
  });

  svr.Options("/list", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Get("/list", [&](const Request &req, Response &res){
    allowCORS(res);
    if (req.has_param("username") && req.has_param("sessionid")) {
      std::string userName = req.get_param_value("username");
      std::string sessionID = req.get_param_value("sessionid");

      for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
        if (row.getString(0) == userName && verify_password(sessionID, row.getString(1))) {
          nlohmann::json j;
          j["list"] = {};
          for (auto item: Sqlite::SqliteStatement(connection, "select username, item, id, isDone from todo where username = ?", userName)) {
            nlohmann::json toDoItem;
            toDoItem["item"] = item.getString(1);
            toDoItem["id"] = item.getString(2);
            toDoItem["isDone"] = item.getString(3);
            j["list"].push_back(toDoItem);
          }
          res.set_content("{\"status\":\"success\", \"data\":" + j.dump() + "}", "application/json");
          return;
        }
      }
    }
    res.set_content("{\"status\":\"failed\"}", "application/json");
  });

  svr.Options("/logout", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/logout", [&](const Request &req, Response &res)
          {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string userSessionID = j["sessionid"];

    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions where username = ?", userName)) {
      if (row.getString(0) == userName && verify_password(userSessionID, row.getString(1))) {
        Sqlite::sqliteExecute(connection, "delete from sessions where username = ?", userName);
        std::cout << "Logout success" << std::endl;
        res.set_content("{\"status\":\"success\"}", "application/json");
        return;
      }
    }

    std::cout << "Logout failed" << std::endl;
    res.set_content("{\"status\":\"failed\"}", "application/json");});
  svr.Options("/register", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/register", [&](const Request &req, Response &res)
           {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string passWord = j["password"];
    std::string passWordHash = hash_password(passWord);

    // for (size_t i = 0; i < users.size(); i++) {
    //   if (users.at(i).username == newUser.username) {
    //     res.set_content("{\"status\":\"failed\"}", "application/json");
    //     return;
    //   }
    // }

    // cancel if username already exists
    for (auto row: Sqlite::SqliteStatement(connection, "select username from users where username = ?", userName)) {
      if (row.getString(0) == userName) {
        std::cout << "Username already exists" << std::endl;
        res.set_content("{\"status\":\"failed\"}", "application/json");
        return;
      }
    }
    // asuume no new user is the same
    // newUser.id = ++currentID;
    // users.push_back(newUser);
    Sqlite::sqliteExecute(connection, "insert into users(username, password) values (?, ?)", userName, passWordHash);
    std::cout << "Regiter success" << std::endl;
    res.set_content("{\"status\":\"success\"}", "application/json"); });

  svr.Options("/login", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/login", [&](const Request &req, Response &res)
           {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string passWord = j["password"];

    // if already logged in
    for (auto row: Sqlite::SqliteStatement(connection, "select username from sessions where username = ?", userName)) {
      if (row.getString(0) == userName) {
        res.set_content("{\"status\":\"failed\"}", "application/json");
        return;
      }
    }

    // check credentials
    // then return sessionid
    for (auto row: Sqlite::SqliteStatement(connection, "select username, password from users where username = ?", userName)) {
      if (row.getString(0) == userName) {
        if (verify_password(passWord, row.getString(1))) {
          nlohmann::json successJSON;
          std::string newUUID = uuid::generate_uuid_v4();
          std::string newUUIDHash = hash_password(newUUID);
          successJSON["sessionid"] = newUUID;
          successJSON["status"] = "success";
          // sessiomStore[e.username] = newUUID;
          // res.set_header("Set-Cookie", std::string("") + "session_id=" + newUUID + "; Path=/; HttpOnly; Secure");
          Sqlite::sqliteExecute(connection, "insert into sessions(username, sessionid) values (?, ?)", userName, newUUIDHash);
          std::cout << "Login success" << std::endl;
          res.set_content(successJSON.dump(), "application/json");
          return;
        }
      }
    }

    std::cout << "Login failed" << std::endl;
    res.set_content("{\"status\":\"failed\"}", "application/json"); });

  svr.listen("localhost", 1234);
}