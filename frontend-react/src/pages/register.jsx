import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Register() {
  let navigate = useNavigate();
  function tryRegister(event) {
    event.preventDefault();
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
      } else {
        alert("Success, returning to login page");
        // window.location.replace("/");
        // return (
        //   <Navigate to="/" replace/>
        // )
        navigate("/", {replace: true});
      }
    });
  }
  return (
    <div className="container">
        <h2>Register</h2>
        <form id="registrationForm">
            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>
            <button onClick={tryRegister}>Register</button>
        </form>
        <a href="./"> Login here </a>
    </div>
  )
}

export default Register