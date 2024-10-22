import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios.post('http://localhost:4000/api/v1/user/register', { name, email, password, confirmPassword })
      .then(response => {
        console.log('Registration success:', response.data);
        navigate('/login');
      })
      .catch(error => {
        console.error('Registration error:', error.response?.data || error.message);
        alert('Registration failed. Please try again.');
      });
  }

  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User signed in:', user);

      await axios.post('http://localhost:4000/api/v1/user/google-signin', {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });

      navigate('/home');
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    }
  }

  return (
    <div className="outer-box">
      <div className="inner-box">
        <header className="signup-header">
          <h1>Register</h1>
        </header>
        <main className="signup-body">
          <form onSubmit={handleSubmit}>
            <p>
              <label htmlFor="fullname">*Name</label>
              <input
                type="text"
                id="fullname"
                placeholder="e.g Rakesh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </p>
            <p>
              <label htmlFor="email">*Email</label>
              <input
                type="email"
                id="email"
                placeholder="e.g rakesh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </p>
            <p className="password-field">
              <label htmlFor="password">*Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas fa-eye${showPassword ? "-slash" : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </p>
            <p className="password-field">
              <label htmlFor="confirm-password">*Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`fas fa-eye${showConfirmPassword ? "-slash" : ""}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </p>
            <button className="button-box" type="submit" id="submit">
              Create Account
            </button>
          </form>
        </main>
        <footer className="signup-footer">
          <p>Already have an Account? <a href="/login"><strong>Login</strong></a></p>
          <p style={{ marginTop: "10px" }}>Or</p>
          <p className="singin-f"
            onClick={handleGoogleSignIn}
            style={{ marginTop: "10px", cursor: "pointer" }}
          >
            <strong>Sign in with Google</strong>
          </p>
        </footer>
      </div>
      <div className="circle c1"></div>
      <div className="circle c2"></div>
    </div>
  );
}

export default Register;
