import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import useNotification from '../../../hooks/useNotification';
import { getSystemPrefs, updateSystemPrefs } from '../../../services/settings/settingsService';

const SystemPreferences = () => {
  const { addNotification } = useNotification();
  const [prefs, setPrefs] = useState({
    dataRetention: '1 year',
    currency: 'USD',
    distanceUnit: 'Miles'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const response = await getSystemPrefs();
        setPrefs(response.data);
      } catch (err) {
        addNotification('Failed to load system preferences.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleChange = (e) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSystemPrefs(prefs);
      addNotification('System preferences saved.', 'success');
    } catch (err) {
      addNotification('Failed to save system preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading system preferences...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Data Retention Policy</label>
        <select name="dataRetention" value={prefs.dataRetention} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <option value="6 months">6 Months</option>
          <option value="1 year">1 Year</option>
          <option value="3 years">3 Years</option>
          <option value="Indefinite">Indefinite</option>
        </select>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>How long to keep historical trip and maintenance records.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Default Currency</label>
        <select name="currency" value={prefs.currency} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD ($)</option>
          <option value="INR">INR (₹)</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Distance Unit</label>
        <select name="distanceUnit" value={prefs.distanceUnit} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <option value="Miles">Miles (mi)</option>
          <option value="Kilometers">Kilometers (km)</option>
        </select>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default SystemPreferences;
