import axios from "axios";
import uuid4 from "uuid4"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [items, setItems] = useState([]);
  let navigate = useNavigate();

  const username = localStorage.getItem("username");
  const sessionid = localStorage.getItem("sessionid");

  useEffect(function() {
    if (username === null || sessionid === null) {
      // window.location.replace("/");
      // return (
      //   <Navigate to="/" replace/>
      // )
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(function () {
    axios
      .get("http://localhost:1234/list", {
        params: {
          username,
          sessionid,
        },
      })
      .then(function (response) {
        // alert();
        // console.log(response.data.data);
        let newList = response.data.data.list ?? [];
        // console.log(newList);
        setItems([...newList]);
        console.log(items);
      });
  }, []);

  function tryLogout(event) {
    event.preventDefault();
    axios
      .post("http://localhost:1234/logout", {
        username,
        sessionid,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to logout!");
        } else {
          // eraseCookie("username");
          // eraseCookie("sessionid");
          localStorage.removeItem("username");
          localStorage.removeItem("sessionid");
          // window.location.replace("/");
          // return (
          //   <Navigate to="/" replace/>
          // )
          navigate("/", { replace: true });
        }
      });
  }

  function tryDelete(event) {
    event.preventDefault();
    axios
      .post("http://localhost:1234/list/delete", {
        username,
        sessionid,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to delete todo list");
        } else {
          // alert("Deleting todo list success");
          setItems([]);
        }
      });
  }

  function tryDeleteOnce(event, todoID) {
    event.preventDefault();
    axios
      .post("http://localhost:1234/list/deleteOne", {
        username,
        sessionid,
        id: todoID
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to delete todo list");
        } else {
          // alert("Deleting a single todo list success");
          axios
            .get("http://localhost:1234/list", {
              params: {
                username,
                sessionid,
              },
            })
            .then(function (response) {
              // alert();
              // console.log(response.data.data);
              let newList = response.data.data.list ?? [];
              // console.log(newList);
              setItems([...newList]);
              console.log(items);
            });
        }
      });
  }

  function tryUpdate(todoID) {
    let todoIsDone = document.getElementById(todoID).checked;
    axios
      .post("http://localhost:1234/list/update", {
        username,
        sessionid,
        id: todoID,
        isDone: todoIsDone ? "True" : "False"
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to delete todo list");
        } else {
          // alert("Update todo list success");
          // document.getElementById(todoID).checked = !document.getElementById(todoID).checked;
          let newItems = items;
          for (let i = 0; i < items.length; i++) {
            if (newItems[i].id === todoID) {
              newItems[i].isDone = todoIsDone ? "True" : "False";
              break;
            }
          }
          setItems([...newItems]);
          // console.table(items);
        }
      });
  }

  function tryInsert(event) {
    event.preventDefault();
    var item = prompt("Insert value:");
    if (item === "") {
      return;
    }
    axios
      .post("http://localhost:1234/list/insert", {
        username,
        sessionid,
        item,
        id: uuid4(),
        isDone: "False"
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to insert!");
        } else {
          axios
            .get("http://localhost:1234/list", {
              params: {
                username,
                sessionid,
              },
            })
            .then(function (response) {
              // alert();
              // console.log(response.data.data);
              let newList = response.data.data.list ?? [];
              // console.log(newList);
              setItems([...newList]);
              // console.log(items);
            });
        }
      });
  }
  return (
    <div className="tw-h-screen tw-grid tw-place-items-center">
      <div className="tw-text-center">
        <h2 className="tw-text-2xl tw-font-bold" id="banner"> Hello {username}! </h2>
        <input className="tw-d-btn tw-m-1" type="button" value="Logout" id="logout" onClick={tryLogout} />
        <input
          className="tw-d-btn tw-m-1"
          type="button"
          value="Delete all"
          id="delete"
          onClick={tryDelete}
        />
        <input className="tw-d-btn tw-m-1" type="button" value="Insert" id="insert" onClick={tryInsert} />
        <div id="list"></div>
        <ul>
          {items.map((item, index) => {
            return <li key={index}> <input className="tw-d-checkbox" type="checkbox" checked={item.isDone === "True" ? true : false} id={item.id} onChange={() => { tryUpdate(item.id) }}/> {item.item} <input className="tw-d-btn" type="button" value="Delete" onClick={(event) => { tryDeleteOnce(event, item.id) }}/> </li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Home;
