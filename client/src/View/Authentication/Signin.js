import React, { useState } from "react";
import { login } from "../../lib/auth";
import { Link } from 'react-router-dom'

function Signin() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ value: "" });

  const handleInputChange = (e) => {
    setUserData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage((prevState) => ({
      value: "",
    }));
    if (userData.username === "" || userData.password === "") {
      setErrorMessage((prevState) => ({
        value: "Empty email/password field",
      }));
    } else {
      login(userData.username, userData.password, (token, name) => {
        localStorage.setItem("autt", token);
        localStorage.setItem("name", name);
        window.location.pathname = "/";
      }, () => {
        setErrorMessage((prevState) => ({ value: "Invalid email/password" }));
      })

    }
  };

  return (
    <div className="text-center">
      <h1>Signin User</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            name="username"
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <Link to='/register' > register </Link>


        {errorMessage.value && (
          <p className="text-danger"> {errorMessage.value} </p>
        )}
      </form>
    </div>
  );
}

export default Signin;
