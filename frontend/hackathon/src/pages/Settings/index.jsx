import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card, { CardBody } from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';

import UserForm from './components/UserForm';
import ProfileSettings from './components/ProfileSettings';
import NotificationSettings from './components/NotificationSettings';
import SystemPreferences from './components/SystemPreferences';
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
            className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span>👥</span> User Management
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span> My Profile
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span>🔔</span> Notifications
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'system' ? styles.active : ''}`}
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

              {activeTab === 'profile' && (
                <div>
                  <div className={styles.sectionTitle}>My Profile</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
                    Update your personal information and preferences.
                  </p>
                  <ProfileSettings />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className={styles.sectionTitle}>Notification Preferences</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
                    Configure how and when you want to be alerted.
                  </p>
                  <NotificationSettings />
                </div>
              )}

              {activeTab === 'system' && (
                <div>
                  <div className={styles.sectionTitle}>System Preferences</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
                    Configure global application settings.
                  </p>
                  <SystemPreferences />
                </div>
              )}

            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
