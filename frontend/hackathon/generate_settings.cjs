const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// SETTINGS MODULE
// ==========================================

writeFile('pages/Settings/Settings.module.css', `
.layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.navItem {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.navItem:hover {
  background-color: rgba(255,255,255,0.02);
  color: var(--text-main);
}

.navItem.active {
  background-color: rgba(255,255,255,0.05);
  color: var(--primary);
  border-left: 3px solid var(--primary);
}

.content {
  flex: 1;
}

.sectionTitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 500px;
}

.formActions {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}
`);

writeFile('pages/Settings/components/UserForm.jsx', `
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import styles from '../Settings.module.css';

const UserForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roleId: '2' // Default to Dispatcher
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const rules = {
      email: { required: true, isEmail: true },
      password: { required: true },
      roleId: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      email: formData.email,
      password: formData.password,
      roleId: Number(formData.roleId)
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Input 
          label="Account Email" 
          name="email"
          type="email"
          placeholder="e.g. employee@transitops.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
        />
        
        <Input 
          label="Temporary Password" 
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />
        
        <Select 
          label="System Role" 
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          error={errors.roleId}
          disabled={loading}
          options={[
            { label: 'Fleet Manager (Full Access)', value: '1' },
            { label: 'Dispatcher (Operations)', value: '2' },
            { label: 'Safety Officer (Drivers & Compliance)', value: '3' }
          ]}
        />
      </div>
      
      <div className={styles.formActions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create System User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
`);

writeFile('pages/Settings/index.jsx', `
import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card, { CardBody } from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';

import UserForm from './components/UserForm';
import styles from './Settings.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { createUser } from '../../services/settings/settingsService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Settings = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('users');
  
  const { execute: callCreateUser, loading } = useApi(createUser);

  const canManageSettings = hasPermission(user?.role, PERMISSIONS.SETTINGS);

  if (!canManageSettings) {
    return (
      <div>
        <PageHeader title="System Settings" />
        <EmptyState 
          icon="🔒" 
          title="Access Restricted" 
          description="Settings and user management are restricted to Fleet Managers only." 
        />
      </div>
    );
  }

  const handleCreateUser = async (userData) => {
    try {
      await callCreateUser(userData);
      addNotification('User account created successfully.', 'success');
      // The form does not clear automatically to allow rapid creation, but in a real app you might want to reset it.
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to create user account.', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="System Settings" />

      <div className={styles.layout}>
        {/* Settings Sidebar Navigation */}
        <div className={styles.sidebar}>
          <div 
            className={\`\${styles.navItem} \${activeTab === 'users' ? styles.active : ''}\`}
            onClick={() => setActiveTab('users')}
          >
            <span>👥</span> User Management
          </div>
          <div 
            className={\`\${styles.navItem} \${activeTab === 'profile' ? styles.active : ''}\`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span> My Profile
          </div>
          <div 
            className={\`\${styles.navItem} \${activeTab === 'notifications' ? styles.active : ''}\`}
            onClick={() => setActiveTab('notifications')}
          >
            <span>🔔</span> Notifications
          </div>
          <div 
            className={\`\${styles.navItem} \${activeTab === 'system' ? styles.active : ''}\`}
            onClick={() => setActiveTab('system')}
          >
            <span>⚙️</span> System Preferences
          </div>
        </div>

        {/* Settings Content Area */}
        <div className={styles.content}>
          <Card>
            <CardBody>
              {activeTab === 'users' && (
                <div>
                  <div className={styles.sectionTitle}>Create System Account</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
                    Provision access for new employees. Ensure you assign the correct role as this restricts their access to specific system modules.
                  </p>
                  <UserForm onSubmit={handleCreateUser} loading={loading} />
                </div>
              )}

              {activeTab !== 'users' && (
                <EmptyState 
                  icon="🚧" 
                  title="Under Construction" 
                  description="This settings module is currently being developed." 
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
`);

console.log("Settings module generated successfully.");
