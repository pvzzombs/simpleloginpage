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

class User
{
public:
  long id;
  std::string username;
  std::string password;
};

void allowCORS(httplib::Response &res) {
  res.set_header("Access-Control-Allow-Origin", "*");
  res.set_header("Allow", "GET, POST, HEAD, OPTIONS");
  res.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Origin, Authorization");
  res.set_header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, HEAD");
}

int main(void)
{
  using namespace httplib;

  long currentID = 0;
  std::vector<User> users;
  std::unordered_map<std::string, std::string> sessiomStore;

  std::cout << "Preparing database" << std::endl;
  Sqlite::SqliteConnection connection("test.db");

  Server svr;

  // svr.Get("/users", [&](const Request &req, Response &res)
  //         {
  //   std::string str = "";
  //   str += "[";
  //   for (auto &e: users) {
  //     str += e.username;
  //     str +=", ";
  //   }
  //   str += "]";
  //   res.set_content(str, "text/plain"); });

  // svr.Get("/verify", [&](const Request &req, Response &res)
  //         {
  //   std::string str;
  //   if (req.has_param("username") && req.has_param("sessionid")) {
  //     std::string userName = req.get_param_value("username");
  //     std::string userUUID = req.get_param_value("sessionid");
  //     if (sessiomStore.count(userName) > 0) {
  //       if (sessiomStore[userName] == userUUID) {
  //         str += userName;
  //         str += " is logged in!";
  //         res.set_content(str, "text/plain");
  //         return;
  //       }
  //     }
  //   }
  //   res.set_content("Unable to verify, maybe logged out", "text/plain"); });
  svr.Options("/logout", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/logout", [&](const Request &req, Response &res)
          {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    std::string userName = j["username"];
    std::string userSessionID = j["sessionid"];
    // if (sessiomStore.count(userName) > 0) {
    //   if (sessiomStore[userName] == userSessionID) {
    //     sessiomStore.erase(userName);
    //     res.set_content("{\"status\":\"success\"}", "text/json");
    //     return;
    //   }
    // }

    for (auto row: Sqlite::SqliteStatement(connection, "select username, sessionid from sessions")) {
      if (row.getString(0) == userName) {
        Sqlite::sqliteExecute(connection, "delete from sessions where username = ?", userName);
        std::cout << "Logout success" << std::endl;
        res.set_content("{\"status\":\"success\"}", "text/json");
        return;
      }
    }

    std::cout << "Logout failed" << std::endl;
    res.set_content("{\"status\":\"failed\"}", "text/json");});
  svr.Options("/register", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/register", [&](const Request &req, Response &res)
           {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    User newUser;
    newUser.username = j["username"];
    newUser.password = j["password"];
    // for (size_t i = 0; i < users.size(); i++) {
    //   if (users.at(i).username == newUser.username) {
    //     res.set_content("{\"status\":\"failed\"}", "text/json");
    //     return;
    //   }
    // }

    // cancel if username already exists
    for (auto row: Sqlite::SqliteStatement(connection, "select username from users")) {
      if (row.getString(0) == newUser.username) {
        std::cout << "Username already exists" << std::endl;
        res.set_content("{\"status\":\"failed\"}", "text/json");
        return;
      }
    }
    // asuume no new user is the same
    // newUser.id = ++currentID;
    // users.push_back(newUser);
    Sqlite::sqliteExecute(connection, "insert into users(username, password) values (?, ?)", newUser.username, newUser.password);
    std::cout << "Regiter success" << std::endl;
    res.set_content("{\"status\":\"success\"}", "text/json"); });

  svr.Options("/login", [&](const Request &req, Response &res){
    allowCORS(res);
  });
  svr.Post("/login", [&](const Request &req, Response &res)
           {
    allowCORS(res);
    nlohmann::json j = nlohmann::json::parse(req.body);
    User oldUser;
    oldUser.username = j["username"];
    oldUser.password = j["password"];
    // for (auto &e: users) {
    //   if (oldUser.username == e.username) {
    //     // storedUser = &e;
    //     // match, check password
    //     if (e.password == oldUser.password) {
    //       std::string newUUID = uuid::generate_uuid_v4();
    //       if (sessiomStore.count(e.username) == 0) {
    //         // made a uniqued session id, store it
    //         nlohmann::json successJSON;
    //         successJSON["sessionid"] = newUUID;
    //         successJSON["status"] = "success";
    //         sessiomStore[e.username] = newUUID;
    //         res.set_header("Set-Cookie", std::string("") + "session_id=" + newUUID + "; Path=/; HttpOnly; Secure");
    //         res.set_content(successJSON.dump(), "text/json");
    //         return;
    //       }
    //     }
    //   }
    // }

    // if already logged in
    for (auto row: Sqlite::SqliteStatement(connection, "select username from sessions")) {
      if (row.getString(0) == oldUser.username) {
        res.set_content("{\"status\":\"failed\"}", "text/json");
        return;
      }
    }

    // check credentials
    // then return sessionid
    for (auto row: Sqlite::SqliteStatement(connection, "select username, password from users")) {
      if (row.getString(0) == oldUser.username) {
        if (row.getString(1) == oldUser.password) {
          nlohmann::json successJSON;
          std::string newUUID = uuid::generate_uuid_v4();
          successJSON["sessionid"] = newUUID;
          successJSON["status"] = "success";
          // sessiomStore[e.username] = newUUID;
          // res.set_header("Set-Cookie", std::string("") + "session_id=" + newUUID + "; Path=/; HttpOnly; Secure");
          Sqlite::sqliteExecute(connection, "insert into sessions(username, sessionid) values (?, ?)", oldUser.username, newUUID);
          std::cout << "Login success" << std::endl;
          res.set_content(successJSON.dump(), "text/json");
          return;
        }
      }
    }

    std::cout << "Login failed" << std::endl;
    res.set_content("{\"status\":\"failed\"}", "text/json"); });

  svr.listen("localhost", 1234);
}