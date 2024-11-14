(function () {
  document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (username == "" || password == "" || confirmPassword == "") {
      alert("Please kindly fill up the required fields.")
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords does not match.");
      return;
    }

    axios.post("http://localhost:1234/register", {
      username,
      password
    }).then(function (response) {
      var status = response.data.status;
      if (status === "failed") {
        alert("Registration Unsuccessful!");
        return;
      } else {
        alert("Success, returning to login page");
        window.location.replace("/");
      }
    });
  });
})();