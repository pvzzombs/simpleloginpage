# Simple Login and Registration Page
## Dependencies:
### Frontend
- Vite
- Axios (Bundled)
### Backend
- C++ Httplib (https://github.com/yhirose/cpp-httplib, Bundled)
- JSON (https://github.com/nlohmann/json, Bundled)
- SQLiteC++ (https://github.com/geekyMrK/SQLiteCpp, Bundled)
- SQLite (https://www.sqlite.org/, External)
- Libsodium (https://doc.libsodium.org/, External)

## Building
### Frontend
You can use either `npm` or `yarn`, but I'll choose `yarn`.  
Using `yarn`:
```
yarn
yarn run dev
```
### Backend
#### Server
C++ code is cross platform, Use any C++11 compiler you want.  
Using `MinGW GCC g++`:
```
g++ -Wall -std=c++11 -IC:/usr/local/include -Iinclude -c server.cpp -o server.o
g++ server.o -LC:/usr/local/lib -lsqlite3 -lsodium -lws2_32 -o server.exe
```
#### Database
SQLite is used and to prepare the tables, execute the commands listed in the `tables.sql`