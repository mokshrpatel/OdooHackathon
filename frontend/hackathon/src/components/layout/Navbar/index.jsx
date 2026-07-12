import React from 'react';
import styles from './Navbar.module.css';
import Badge from '../../ui/Badge';
import NotificationBell from './NotificationBell';

const Navbar = ({ user = { name: 'Admin User', role: 'Fleet Manager' } }) => {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {/* Can put search or breadcrumbs here */}
        <Badge variant="info">v1.0 Beta</Badge>
      </div>
      <div className={styles.right}>
        <NotificationBell />
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {user.name.charAt(0)}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
