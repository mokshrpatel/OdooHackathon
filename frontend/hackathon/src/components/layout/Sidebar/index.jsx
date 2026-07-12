import React from 'react';
import styles from './Sidebar.module.css';

// Using dummy state for now, will integrate React Router later when building layout module
const Sidebar = ({ currentPath = '/dashboard' }) => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Vehicles', path: '/vehicles', icon: '🚚' },
    { name: 'Drivers', path: '/drivers', icon: '🧑‍✈️' },
    { name: 'Trips', path: '/trips', icon: '📍' },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { name: 'Fuel & Expenses', path: '/expenses', icon: '⛽' },
    { name: 'Reports', path: '/reports', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        TransitOps
      </div>
      <nav className={styles.nav}>
        {links.map((link) => (
          <div 
            key={link.name} 
            className={`${styles.navItem} ${currentPath === link.path ? styles.active : ''}`}
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </div>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.navItem}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
