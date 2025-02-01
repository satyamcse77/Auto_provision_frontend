import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Image/logoDark.png"
const CookieName = process.env.REACT_APP_COOKIENAME || "auto provision";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const BaseUrlTr069 = "192.168.250.51" || "localhost";
  // const BaseUrlTr069 = "localhost";
  const PORTTr069 = "3000";

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === "") {
      alert("Username is required.");
      return;
    } else if (password === "") {
      alert("Password is required.");
      return;
    }
    try {
      let result = await fetch(`http://${BaseUrlTr069}:${PORTTr069}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      result = await result.json();
      if (result.AuthToken) {
        const Data = {
          AuthToken: result.AuthToken
        }
        const cookieString = `${CookieName}=${JSON.stringify(Data)}`;
        document.cookie = cookieString;
        
        navigate("/home");
      } else {
        alert("Incorrect Email and password.");
      }
    } catch (error) {
      alert("Server error, please try again.");
      console.error(error);
    }
  };

  return (
    <>
       
      <div className="login-container21">
        <img className="login-img" width={350} src ={Logo} alt ='Loading...'/>
        <form onSubmit={handleSubmit} className="login-form21">
          <h2>Login</h2>
          <div className="form-control21">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="form-control21">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
