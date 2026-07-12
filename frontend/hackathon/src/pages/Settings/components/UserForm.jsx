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
