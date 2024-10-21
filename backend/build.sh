gcc -Wall -Iinclude -c sqlite3.c -o sqlite3.o
g++ -Wall -std=c++11 -Iinclude -c test.cpp -o test.o
g++ test.o sqlite3.o -lws2_32 -o test.exe 
# gcc -Wall -Iinclude shell.c sqlite3.c -o shell.exe