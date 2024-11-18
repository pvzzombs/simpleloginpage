import axios from "axios";
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
          alert("Deleting todo list success");
          setItems([]);
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
              console.log(items);
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
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Home;
