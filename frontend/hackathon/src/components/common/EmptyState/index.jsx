import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon = '📁', title = 'No Data Found', description = 'There are currently no records to display.', action }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
