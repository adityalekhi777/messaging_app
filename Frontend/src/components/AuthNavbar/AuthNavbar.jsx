import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthNavbar.module.css';

const AuthNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.title}>Messaging App</h1>
        <div className={styles.authLinks}>
          <Link to="/login" className={styles.link}>Login</Link>
          <Link to="/signup" className={styles.link}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;