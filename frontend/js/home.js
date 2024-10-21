(function () {
  document.getElementById("banner").innerText = "Hello " + getCookie("username") + "!";
  document.getElementById("logout").onclick = function (e) {
    e.preventDefault();

    const username = getCookie("username");
    const sessionid = getCookie("sessionid");

    axios.post("http://localhost:1234/logout", {
      username,
      sessionid
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Unable to logout!");
        return;
      } else {
        eraseCookie("username");
        eraseCookie("sessionid");
        window.location.replace("home.html");
      }
    });
  }
})();