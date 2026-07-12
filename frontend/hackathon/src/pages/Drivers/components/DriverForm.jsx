import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import styles from '../Drivers.module.css';

const DriverForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: '',
    licenseExpiryDate: '',
    contactNumber: ''
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
      name: { required: true },
      licenseNumber: { required: true },
      licenseCategory: { required: true },
      licenseExpiryDate: { required: true },
      contactNumber: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Input 
          label="Full Name" 
          name="name"
          placeholder="e.g. Alex Johnson"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={loading}
        />
        <Input 
          label="License Number" 
          name="licenseNumber"
          placeholder="e.g. DL-987654321"
          value={formData.licenseNumber}
          onChange={handleChange}
          error={errors.licenseNumber}
          disabled={loading}
        />
        <Select 
          label="License Category" 
          name="licenseCategory"
          value={formData.licenseCategory}
          onChange={handleChange}
          error={errors.licenseCategory}
          disabled={loading}
          options={[
            { label: 'Light (Class C)', value: 'Light' },
            { label: 'Heavy (Class A)', value: 'Heavy' },
            { label: 'Medium (Class B)', value: 'Medium' }
          ]}
        />
        <Input 
          label="License Expiry Date" 
          name="licenseExpiryDate"
          type="date"
          value={formData.licenseExpiryDate}
          onChange={handleChange}
          error={errors.licenseExpiryDate}
          disabled={loading}
        />
        <Input 
          label="Contact Number" 
          name="contactNumber"
          type="tel"
          placeholder="e.g. +1234567890"
          value={formData.contactNumber}
          onChange={handleChange}
          error={errors.contactNumber}
          disabled={loading}
        />
      </div>
      
      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register Driver'}
        </Button>
      </div>
    </form>
  );
};

export default DriverForm;
