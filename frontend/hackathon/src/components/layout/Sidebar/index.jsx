import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import useAuth from '../../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../../utils/rolePermissions';

const Sidebar = () => {
  const { logout, user } = useAuth();
  
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: PERMISSIONS.DASHBOARD },
    { name: 'Vehicles', path: '/vehicles', icon: '🚚', roles: PERMISSIONS.VEHICLES },
    { name: 'Drivers', path: '/drivers', icon: '🧑‍✈️', roles: PERMISSIONS.DRIVERS },
    { name: 'Trips', path: '/trips', icon: '📍', roles: PERMISSIONS.TRIPS },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧', roles: PERMISSIONS.MAINTENANCE },
    { name: 'Fuel & Expenses', path: '/expenses', icon: '⛽', roles: PERMISSIONS.EXPENSES },
    { name: 'Reports', path: '/reports', icon: '📈', roles: PERMISSIONS.REPORTS },
    { name: 'Settings', path: '/settings', icon: '⚙️', roles: PERMISSIONS.SETTINGS },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        TransitOps
      </div>
      <nav className={styles.nav}>
        {links.map((link) => {
          if (link.roles && !hasPermission(user?.role, link.roles)) return null;
          
          return (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <div className={styles.navItem} onClick={logout} style={{ cursor: 'pointer' }}>
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
