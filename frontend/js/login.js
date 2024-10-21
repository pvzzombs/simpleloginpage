(function () {
  document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username == "" || password == "") {
      alert("Please kindly fill up the required fields.")
      return;
    }

    axios.post("http://localhost:1234/login", {
      username,
      password
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Login Unsuccessful!");
        return;
      } else {
        var sessionid = response.data.sessionid;
        setCookie("username", username, 1);
        setCookie("sessionid", sessionid, 1);
        window.location.replace("home.html");
      }
    });
  });
})()