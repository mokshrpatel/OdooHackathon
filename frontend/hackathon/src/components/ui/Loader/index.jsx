import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ fullPage = false, text = 'Loading...' }) => {
  const containerStyle = fullPage ? { height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, background: 'var(--bg-main)', zIndex: 9999 } : {};
  
  return (
    <div className={styles.loaderContainer} style={containerStyle}>
      <div className={styles.spinner}></div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default Loader;
