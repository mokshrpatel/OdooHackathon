import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input 
          ref={ref}
          className={`${styles.input} ${icon ? styles.hasIcon : ''} ${error ? styles.error : ''}`} 
          {...props} 
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
