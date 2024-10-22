import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Resources/login.css";
import axios from "axios";
// import { response } from "express";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  function handleLogin(e) {
    e.preventDefault();
  axios.post('http://localhost:4000/api/v1/user/login', {email,password})
  .then(response => {
    console.log('Login Sucess:', response.data);
    console.log("email:", email);
    console.log("password:", password);
    navigate('/home');
  })

  }

  return (
    <div className="outer-box">
      <div className="inner-box">
        <header className="login-header">
          <h1>Login</h1>
        </header>
        <main className="login-body">
          <form onSubmit={handleLogin}>
            <p>
              <label htmlFor="email">*Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </p>
            <p>
              <label htmlFor="password">*Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </p>
            <button className="button-box" type="submit" id="submit">
              Login
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <Link to="/register">Click here to register</Link>
          </p>
        </main>
      </div>
    </div>
  );
}

export default Login;
