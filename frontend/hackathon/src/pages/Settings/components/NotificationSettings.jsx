import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import useNotification from '../../../hooks/useNotification';
import { getNotificationPrefs, updateNotificationPrefs } from '../../../services/settings/settingsService';

const NotificationSettings = () => {
  const { addNotification } = useNotification();
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    maintenanceReminders: true,
    tripUpdates: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const response = await getNotificationPrefs();
        setPrefs(response.data);
      } catch (err) {
        addNotification('Failed to load notification preferences.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateNotificationPrefs(prefs);
      addNotification('Notification preferences saved.', 'success');
    } catch (err) {
      addNotification('Failed to save preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: '500' }}>Email Alerts</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive critical alerts via email.</div>
        </div>
        <input type="checkbox" checked={prefs.emailAlerts} onChange={() => togglePref('emailAlerts')} style={{ transform: 'scale(1.2)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: '500' }}>SMS Alerts</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive SMS text messages for urgent events.</div>
        </div>
        <input type="checkbox" checked={prefs.smsAlerts} onChange={() => togglePref('smsAlerts')} style={{ transform: 'scale(1.2)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: '500' }}>Maintenance Reminders</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Notify when vehicles are due for service.</div>
        </div>
        <input type="checkbox" checked={prefs.maintenanceReminders} onChange={() => togglePref('maintenanceReminders')} style={{ transform: 'scale(1.2)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontWeight: '500' }}>Trip Updates</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Notify on trip dispatch and completion.</div>
        </div>
        <input type="checkbox" checked={prefs.tripUpdates} onChange={() => togglePref('tripUpdates')} style={{ transform: 'scale(1.2)' }} />
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default NotificationSettings;
