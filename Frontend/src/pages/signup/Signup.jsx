import React from "react";
import styles from "./signup.module.css";

const Signup = () => {
  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm}>
        <h2>Sign Up</h2>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="tel" placeholder="Phone Number" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
