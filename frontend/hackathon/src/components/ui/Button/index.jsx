import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', icon, ...props }) => {
  return (
    <button 
      type={type}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
