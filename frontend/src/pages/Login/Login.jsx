import axios from "axios";
import baseURL from "../../BaseURL";
import Form from "../../components/Form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();

  useEffect(function () {
    if (
      localStorage.getItem("sessionid") != null &&
      localStorage.getItem("username") !== null
    ) {
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

    // console.log(username);
    // console.log(password);

    if (username == "" || password == "") {
      alert("Please kindly fill up the required fields.");
      return;
    }

    axios
      .post(baseURL + "/login", {
        username,
        password,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          console.log(response)
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

  function handleLogin(values) {
    // Get the form data
    const username = values.user;
    const password = values.pw;
    // console.table(values);

    if (username == "" || password == "") {
      alert("Please kindly fill up the required fields.");
      return;
    }

    axios
      .post(baseURL + "/login", {
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
    <div className="container text-center" style={{
      width: "15%"
    }}>
      <form onSubmit={tryLogin} className="row justify-content-center">
        <div className="col-12">
          <input type="text" placeholder="Username here" id="username" name="username" className="form-control"/>
        </div>
        <div className="col-12">
          <input type="password" placeholder="Password here" name="password" id="password" className="form-control"/>
        </div>
        <input type="submit" value="Login" className="btn"/>
        <p className="text-center">Not registered yet? Register <a href='/register'>here.</a></p>
      </form>
    </div>
  );
}

export default Login;
