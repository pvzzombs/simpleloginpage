import axios from "axios";
import baseURL from "../../BaseURL";
import Form from "../../components/Form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
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

  function tryRegister(event) {
    event.preventDefault();
    // Get the form data
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (username == "" || password == "" || confirmPassword == "") {
      alert("Please kindly fill up the required fields.");
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords does not match.");
      return;
    }

    axios
      .post(baseURL + "/register", {
        username,
        password,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Registration Unsuccessful!");
        } else {
          alert("Success, returning to login page");
          // window.location.replace("/");
          // return (
          //   <Navigate to="/" replace/>
          // )
          navigate("/", { replace: true });
        }
      });
  }

  function handleRegister(values) {
    const username = values.user;
    const password = values.pw;
    const confirmPassword = values.pw2;

    if (username == "" || password == "" || confirmPassword == "") {
      alert("Please kindly fill up the required fields.");
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords does not match.");
      return;
    }

    axios
      .post(baseURL + "/register", {
        username,
        password,
      })
      .then(function (response) {
        var status = response.data.status;
        if (status === "failed") {
          alert("Registration Unsuccessful!");
        } else {
          alert("Success, returning to login page");
          // window.location.replace("/");
          // return (
          //   <Navigate to="/" replace/>
          // )
          navigate("/", { replace: true });
        }
      });
  }

  return (
    <div>
      <form onSubmit={tryRegister} className="container text-center" style={{
        width: "15%"
      }}>
        <input type="text" placeholder="Email here" id="username" name="username" className="form-control"/>
        <input type="password" placeholder="Password here" name="password" id="password" className="form-control"/>
        <input type="password" placeholder="Enter Password again" name="confirmPassword" id="confirmPassword" className="form-control"/>
        <input type="submit" value="Login" className="btn"/>
        <p>Already have account? Login <a href='/'>here.</a></p>
      </form>
    </div>
  );
}

export default Register;
