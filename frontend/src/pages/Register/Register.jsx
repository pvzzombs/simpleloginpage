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

  const styles = {
    form: {
      boxShadow: "0px 5px 10px 1px lightgray",
      borderWidth: "1px",
      borderColor: "lightgray",
      borderRadius: "10px",
      width: "300px",
    },
    title: {
      fontWeight: "bold",
      fontSize: "20px",
      marginBottom: "10px",
    },
    inputBox: {
      height: "30px",
      width: "94%",
      borderColor: "lightgray",
      borderWidth: "1px",
      paddingLeft: "10px",
    },
    submitButton: {
      height: "30px",
      backgroundColor: "#dedede",
      borderWidth: "0px",
    },
  };

  const fields = [
    {
      id: "user",
      placeholder: "Username",
      type: "text",
    },
    {
      id: "pw",
      placeholder: "Password",
      type: "password",
      showPasswordText: "Show Password",
    },
    {
      id: "pw2",
      placeholder: "Confirm Password",
      type: "password",
      showPasswordText: "Show Password",
    },
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
    <Form
      title={"Register"}
      fields={fields}
      submitButton={{ label: "Submit" }}
      formSubmit={{ callback: handleRegister}}
      styles={styles}
      extra="<p>Already have account? Login <a href='/'>here.</a></p>"
    />
    </div>
  );
}

export default Register;
