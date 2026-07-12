import React, { useState, useEffect } from 'react';
import Card, { CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import { getProfile, updateProfile } from '../../../services/settings/settingsService';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        setFormData({ ...formData, ...response.data });
      } catch (err) {
        addNotification('Failed to load profile details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      addNotification('Profile updated successfully.', 'success');
    } catch (err) {
      addNotification('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
      <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
      <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
      <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Timezone</label>
        <select name="timezone" value={formData.timezone} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          <option value="UTC">UTC</option>
          <option value="EST">Eastern Standard Time (EST)</option>
          <option value="PST">Pacific Standard Time (PST)</option>
        </select>
      </div>
      <div style={{ marginTop: '16px' }}>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettings;
