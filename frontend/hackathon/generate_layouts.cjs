const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// LAYOUTS
// ==========================================

writeFile('layouts/AuthLayout.module.css', `
.authContainer {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
  background-image: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  padding: 24px;
}

.authContent {
  width: 100%;
  max-width: 420px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 32px;
}
`);

writeFile('layouts/AuthLayout.jsx', `
import React from 'react';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authContent}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
`);

writeFile('layouts/DashboardLayout.module.css', `
.dashboardContainer {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-main);
}

.sidebarWrapper {
  width: 250px;
  flex-shrink: 0;
}

.mainWrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Important for truncating content inside flex child */
}

.content {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 64px); /* Subtract Navbar height */
}
`);

writeFile('layouts/DashboardLayout.jsx', `
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
`);

// ==========================================
// PAGE PLACEHOLDERS
// ==========================================
const pages = [
  'Authentication', 'Dashboard', 'Vehicles', 'Drivers', 'Trips', 
  'Maintenance', 'Expenses', 'Reports', 'Settings', 'NotFound', 'Unauthorized'
];

pages.forEach(page => {
  const fileContent = "import React from 'react';\n" +
    "import PageHeader from '../../components/common/PageHeader';\n" +
    "import Card from '../../components/ui/Card';\n\n" +
    "const " + page + " = () => {\n" +
    "  return (\n" +
    "    <div>\n" +
    "      <PageHeader title='" + page + "' />\n" +
    "      <Card>\n" +
    "        <div style={{ padding: '24px', color: 'var(--text-muted)' }}>\n" +
    "          " + page + " module is under construction.\n" +
    "        </div>\n" +
    "      </Card>\n" +
    "    </div>\n" +
    "  );\n" +
    "};\n\n" +
    "export default " + page + ";\n";
    
  writeFile('pages/' + page + '/index.jsx', fileContent);
});

console.log("Layouts and basic page placeholders generated successfully.");
