import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainNavbar.module.css';

const MainNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.buttons}>
        <button className={styles.button}>Profile</button>
        <button className={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MainNavbar;