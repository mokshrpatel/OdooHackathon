import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import styles from '../Vehicles.module.css';

const VehicleForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    nameModel: '',
    type: '',
    maxLoadCapacity: '',
    odometer: '0',
    acquisitionCost: ''
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
      registrationNumber: { required: true },
      nameModel: { required: true },
      type: { required: true },
      maxLoadCapacity: { required: true, isPositive: true },
      odometer: { required: true, isPositive: true },
      acquisitionCost: { required: true, isPositive: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    // Format numbers
    const payload = {
      ...formData,
      maxLoadCapacity: Number(formData.maxLoadCapacity),
      odometer: Number(formData.odometer),
      acquisitionCost: Number(formData.acquisitionCost)
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Input 
          label="Registration Number" 
          name="registrationNumber"
          placeholder="e.g. Van-05"
          value={formData.registrationNumber}
          onChange={handleChange}
          error={errors.registrationNumber}
          disabled={loading}
        />
        <Input 
          label="Name / Model" 
          name="nameModel"
          placeholder="e.g. Ford Transit"
          value={formData.nameModel}
          onChange={handleChange}
          error={errors.nameModel}
          disabled={loading}
        />
        <Select 
          label="Vehicle Type" 
          name="type"
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          disabled={loading}
          options={[
            { label: 'Van', value: 'Van' },
            { label: 'Truck', value: 'Truck' },
            { label: 'Car', value: 'Car' }
          ]}
        />
        <Input 
          label="Max Load Capacity (kg)" 
          name="maxLoadCapacity"
          type="number"
          placeholder="e.g. 500"
          value={formData.maxLoadCapacity}
          onChange={handleChange}
          error={errors.maxLoadCapacity}
          disabled={loading}
        />
        <Input 
          label="Initial Odometer (km)" 
          name="odometer"
          type="number"
          placeholder="e.g. 0"
          value={formData.odometer}
          onChange={handleChange}
          error={errors.odometer}
          disabled={loading}
        />
        <Input 
          label="Acquisition Cost ($)" 
          name="acquisitionCost"
          type="number"
          placeholder="e.g. 45000"
          value={formData.acquisitionCost}
          onChange={handleChange}
          error={errors.acquisitionCost}
          disabled={loading}
        />
      </div>
      
      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
