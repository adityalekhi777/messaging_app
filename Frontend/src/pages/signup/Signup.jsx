import React, { useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        password,
      });
      console.log("Response:", response);
      console.log("Token:", response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("Redirecting to home page...");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <>
      <div className={styles.signupContainer}>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Signup;
