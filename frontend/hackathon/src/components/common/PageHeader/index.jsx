import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, action }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
};

export default PageHeader;
