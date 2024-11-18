import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();

  useEffect(function() {
    if (localStorage.getItem("sessionid") != null && localStorage.getItem("username") !== null) {
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
      .post("http://localhost:1234/register", {
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
    <div className="tw-h-screen tw-grid tw-place-items-center">
    <div className="tw-d-card tw-d-card-bordered tw-bg-base-100 tw-w-96 tw-shadow-xl tw-text-center">
      <form className="tw-d-card-body tw-text-center" id="registrationForm" onSubmit={tryRegister}>
      <h2 className="tw-text-2xl tw-font-bold">Register</h2>
        <div className="">
          <input placeholder="Username" className="tw-d-input tw-d-input-bordered tw-w-full tw-m-1" type="text" id="username" name="username" required />
        </div>
        <div className="">
          <input placeholder="Password" className="tw-d-input tw-d-input-bordered tw-w-full tw-m-1" type="password" id="password" name="password" required />
        </div>
        <div className="">
          <input
            placeholder="Confirm Password"
            className="tw-d-input tw-d-input-bordered tw-w-full tw-m-1"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <button className="tw-d-btn" type="submit">Register</button>
        <a href="./"> Login here </a>
      </form>
    </div>
    </div>
  );
}

export default Register;
