import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import styles from './DashboardLayout.module.css';
import useAuth from '../hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  
  const displayUser = user || { name: 'Demo User', role: 'Fleet Manager' };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebarWrapper}>
        <Sidebar currentPath={typeof window !== 'undefined' ? window.location.pathname : '/dashboard'} />
      </div>
      <div className={styles.mainWrapper}>
        <Navbar user={displayUser} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
