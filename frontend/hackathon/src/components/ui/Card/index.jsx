import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, className = '' }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

export const CardHeader = ({ title, action, className = '' }) => (
  <div className={`${styles.header} ${className}`}>
    {title && <h3 className={styles.title}>{title}</h3>}
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${styles.body} ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`${styles.footer} ${className}`}>{children}</div>
);

export default Card;
