# Simple Login and Registration Page
## Dependencies:
### Frontend
- Vite
- Axios
### Backend (C++)
- C++ Httplib (https://github.com/yhirose/cpp-httplib, Bundled)
- JSON (https://github.com/nlohmann/json, Bundled)
- SQLiteC++ (https://github.com/geekyMrK/SQLiteCpp, Bundled)
- SQLite (https://www.sqlite.org/, External)
- Libsodium (https://doc.libsodium.org/, External)
### Backend (Python)
- FastAPI (https://fastapi.tiangolo.com/)
- SQLModel (https://sqlmodel.tiangolo.com/)
### Backend (PHP)
- SQLite (https://www.php.net/manual/en/book.sqlite3.php)
- Sodium (https://www.php.net/manual/en/book.sodium.php)

## Building & Running
### Frontend
You can use either `npm` or `yarn`, but I'll choose `yarn`.  
Using `yarn`:
```
yarn
yarn run dev
```
### Backend (C++)
#### Server
C++ code is cross platform, Use any C++11 compiler you want.  
Using `MinGW GCC g++`:
```
g++ -Wall -std=c++11 -IC:/usr/local/include -Iinclude -c server.cpp -o server.o
g++ server.o -LC:/usr/local/lib -lsqlite3 -lsodium -lws2_32 -o server.exe
```
#### Database
SQLite is used and to prepare the tables, execute the commands listed in the `tables.sql`

### Backend (Python)
#### Server & Database
Check `requirements.txt` for the dependencies, you may use python virtual environment.  
Using `fastapi`:
```
fastapi dev server.py
```
### Backend (PHP)
#### Server
Using the PHP builtin web server:  
```
php -S localhost:8000
```
#### Database
Use SQLite to generate the database and the required tables.