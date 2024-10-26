(function () {
  const username = localStorage.getItem("username");
  const sessionid = localStorage.getItem("sessionid");

  axios.get("http://localhost:1234/list", {
    params: {
      username,
      sessionid
    }
  }).then(function (response) {
    // alert();
    console.log(response.data.data);
    var list = response.data.data.list ?? [];
    document.getElementById("list").innerText = "";
    for (var i = 0; i < list.length; i++) {
      document.getElementById("list").innerText += list[i] + "\n";
    }
  });

  document.getElementById("banner").innerText = "Hello " + localStorage.getItem("username") + "!";

  document.getElementById("insert").onclick = function (e) {
    e.preventDefault();
    var item = prompt("Insert value:");
    axios.post("http://localhost:1234/list/insert", {
      username,
      sessionid,
      item
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Unable to insert!");
        return;
      } else {
        axios.get("http://localhost:1234/list", {
          params: {
            username,
            sessionid
          }
        }).then(function (response) {
          // alert();
          // console.log(response.data.data);
          var list = response.data.data.list ?? [];
          document.getElementById("list").innerText = "";
          for (var i = 0; i < list.length; i++) {
            document.getElementById("list").innerText += list[i] + "\n";
          }
        });
      }
    });
  }

  document.getElementById("delete").onclick = function (e) {
    e.preventDefault();
    axios.post("http://localhost:1234/list/delete", {
      username,
      sessionid
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Unable to delete todo list");
      } else {
        alert("Deleting todo list success");
        document.getElementById("list").innerText = "";
      }
    });
  }

  document.getElementById("logout").onclick = function (e) {
    e.preventDefault();

    // const username = getCookie("username");
    // const sessionid = getCookie("sessionid");

    axios.post("http://localhost:1234/logout", {
      username,
      sessionid
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Unable to logout!");
        return;
      } else {
        // eraseCookie("username");
        // eraseCookie("sessionid");
        localStorage.removeItem("username");
        localStorage.removeItem("sessionid");
        window.location.replace("/");
      }
    });
  }
})();