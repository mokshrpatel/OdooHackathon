const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// Sidebar
writeFile('components/layout/Sidebar/Sidebar.module.css', `
.sidebar {
  width: 250px;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  transition: all var(--transition);
  z-index: 40;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.nav {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-weight: 500;
  transition: all var(--transition);
  cursor: pointer;
}

.navItem:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

.navItem.active {
  background-color: var(--primary-glow);
  color: var(--primary);
}

.footer {
  padding: 24px 16px;
  border-top: 1px solid var(--border-color);
}
`);

writeFile('components/layout/Sidebar/index.jsx', `
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
            className={\`\${styles.navItem} \${currentPath === link.path ? styles.active : ''}\`}
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
`);

// Navbar
writeFile('components/layout/Navbar/Navbar.module.css', `
.navbar {
  height: 64px;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 30;
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.userInfo {
  display: flex;
  flex-direction: column;
}

.userName {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.2;
}

.userRole {
  font-size: 0.75rem;
  color: var(--text-muted);
}
`);

writeFile('components/layout/Navbar/index.jsx', `
import React from 'react';
import styles from './Navbar.module.css';
import Badge from '../../ui/Badge';

const Navbar = ({ user = { name: 'Admin User', role: 'Fleet Manager' } }) => {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {/* Can put search or breadcrumbs here */}
        <Badge variant="info">v1.0 Beta</Badge>
      </div>
      <div className={styles.right}>
        <div style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>🔔</div>
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
`);

// ProtectedRoute
writeFile('components/layout/ProtectedRoute/index.jsx', `
import React from 'react';

// Placeholder for ProtectedRoute, will use react-router-dom later
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
`);

console.log("Layout components generated successfully.");
