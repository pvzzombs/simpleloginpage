import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();

  useEffect(function() {
    if (localStorage.getItem("sessionid") != null) {
      // window.location.replace("./home");
      navigate("/home", { replace: true });
      // return (
      //   <Navigate to="/home" replace/>
      // )
    }
  }, []);

  function tryLogin(event) {
    event.preventDefault();
    // Get the form data
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username == "" || password == "") {
      alert("Please kindly fill up the required fields.");
      return;
    }

    axios
      .post("http://localhost:1234/login", {
        username,
        password,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Login Unsuccessful!");
        } else {
          const sessionid = response.data.sessionid;
          // setCookie("username", username, 1);
          // setCookie("sessionid", sessionid, 1);
          localStorage.setItem("username", username);
          localStorage.setItem("sessionid", sessionid);
          //  window.location.replace("/home");
          // alert("Success");
          navigate("/home", { replace: true });
        }
      });
  }
  return (
    <div>
      <div className="container">
        <h2>Login</h2>
        <form id="loginForm" onSubmit={tryLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <a href="./register"> Register here </a>
      </div>
    </div>
  );
}

export default Login;
