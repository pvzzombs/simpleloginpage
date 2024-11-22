import axios from "axios";
import uuid4 from "uuid4"
import deepClone from "deep-clone"
import baseURL from "../../BaseURL.jsx"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [items, setItems] = useState([]);
  let navigate = useNavigate();

  const username = localStorage.getItem("username");
  const sessionid = localStorage.getItem("sessionid");

  useEffect(function() {
    if (username === null || sessionid === null) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(function () {
    axios
      .get(baseURL + "/list", {
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
  }, []);

  function tryLogout() {
    axios
      .post(baseURL + "/logout", {
        username,
        sessionid,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to logout!");
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("sessionid");
          navigate("/", { replace: true });
        }
      });
  }

  function tryDelete() {
    axios
      .post(baseURL + "/list/delete", {
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
    // event.preventDefault();
    axios
      .post(baseURL + "/list/deleteOne", {
        username,
        sessionid,
        id: todoID
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to delete todo list");
        } else {
          let newItems = deepClone(items);
          let indexToBeRemoved = -1;
          for (let i = 0; i < newItems.length; i++) {
            if (newItems[i].id === todoID) {
              indexToBeRemoved = i;
            }
          }
          newItems.splice(indexToBeRemoved, 1);
          setItems([...newItems]);
        }
      });
  }

  function tryChange(todoID, todoItem) {
    var item = prompt("Change value:", todoItem);
    if (item === "") {
      return;
    }
    tryUpdate(todoID, item);
  }

  function tryUpdate(todoID, todoItem) {
    const todoIsDone = document.getElementById(todoID).checked;
    axios
      .post(baseURL + "/list/update", {
        username,
        sessionid,
        id: todoID,
        item: todoItem,
        isDone: todoIsDone ? "True" : "False"
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to delete todo list");
        } else {
          // alert("Update todo list success");
          let newItems = deepClone(items);
          for (let i = 0; i < newItems.length; i++) {
            if (newItems[i].id === todoID) {
              newItems[i].isDone = todoIsDone ? "True" : "False";
              newItems[i].item = todoItem;
              break;
            }
          }
          setItems([...newItems]);
          // console.table(items);
        }
      });
  }

  function tryInsert() {
    var item = prompt("Insert value:");
    var id = uuid4();
    var isDone = "False";
    if (item === "") {
      return;
    }
    axios
      .post(baseURL + "/list/insert", {
        username,
        sessionid,
        item,
        id,
        isDone
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Unable to insert!");
        } else {
          let newItems = deepClone(items);
          newItems.push({
            item,
            id,
            isDone
          });
          setItems([...newItems]);
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
        <ul>
          {items.map((item, index) => {
            return (<li key={index}> <input className="tw-d-checkbox" type="checkbox" checked={item.isDone === "True" ? true : false} id={item.id} onChange={() => { tryUpdate(item.id, item.item) }}/>
            {item.item}
            <input className="tw-d-btn tw-m-1" type="button" value="Edit" onClick={() => { tryChange(item.id, item.item) }}/>
            <input className="tw-d-btn tw-m-1" type="button" value="Delete" onClick={(event) => { tryDeleteOnce(event, item.id) }}/> </li>);
          })}
        </ul>
      </div>
    </div>
  );
}

export default Home;
