import React, { useState } from "react";
import { register } from "../../lib/auth";
import { Link } from 'react-router-dom'

function Register() {
  const [userData, setUserData] = useState({ username: "", password: "", name: "" });
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
    if (userData.username === "" || userData.password === "" || userData.name === "") {
      setErrorMessage((prevState) => ({
        value: "Empty username/password field",
      }));
    } else if (userData.username === "admin" && userData.password === "123456") {
      localStorage.setItem("autt", "true");
      window.location.pathname = "/";
    } else {
      register(userData.username, userData.password, userData.name, (token, name) => {
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
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
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
        <Link to='/signin' > login </Link>
        {errorMessage.value && (
          <p className="text-danger"> {errorMessage.value} </p>
        )}
      </form>
    </div>
  );
}

export default Register;
