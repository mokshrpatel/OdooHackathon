import React from 'react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
