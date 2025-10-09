import React from "react";
import styles from "./login.module.css";

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm}>
        <h2>Login</h2>
        <input type="text" placeholder="Email or Phone Number" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
