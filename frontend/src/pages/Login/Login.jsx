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
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
    <Form
      title={"Login"}
      fields={fields}
      submitButton={{ label: "Submit" }}
      formSubmit={{ callback: handleLogin}}
      styles={styles}
      extra="<p>Not registered yet? Register <a href='/register'>here.</a></p>"
    />
    </div>
  );
}

export default Login;
