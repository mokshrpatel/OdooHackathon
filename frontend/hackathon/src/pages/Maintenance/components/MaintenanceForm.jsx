import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getAvailableVehicles } from '../../../services/vehicles/vehicleService';
import styles from '../Maintenance.module.css';

const MaintenanceForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    cost: ''
  });
  
  const [errors, setErrors] = useState({});
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    // Only available vehicles can be put into maintenance
    const fetchResources = async () => {
      try {
        const vehRes = await getAvailableVehicles();
        const vData = vehRes.data || vehRes;
        setAvailableVehicles(Array.isArray(vData) ? vData : []);
      } catch (err) {
        console.error('Failed to load vehicles');
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const rules = {
      vehicleId: { required: true },
      description: { required: true },
      cost: { required: true, isPositive: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      description: formData.description,
      cost: Number(formData.cost)
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Select 
          label="Select Vehicle (Available Only)" 
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          error={errors.vehicleId}
          disabled={loading || loadingOptions}
          options={availableVehicles.map(v => ({ 
            label: `${v.registrationNumber} - ${v.nameModel}`, 
            value: v.id 
          }))}
        />
        
        <Input 
          label="Maintenance Description" 
          name="description"
          placeholder="e.g. Routine Oil Change and Brake Inspection"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          disabled={loading}
        />
        
        <Input 
          label="Estimated Cost ($)" 
          name="cost"
          type="number"
          placeholder="e.g. 150.00"
          value={formData.cost}
          onChange={handleChange}
          error={errors.cost}
          disabled={loading}
        />
      </div>
      
      <p style={{ marginTop: '16px', fontSize: '0.875rem', color: 'var(--warning)' }}>
        Note: Opening this record will immediately change the vehicle's status to "In Shop" and hide it from dispatch.
      </p>

      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading || loadingOptions}>
          {loading ? 'Logging...' : 'Open Maintenance Record'}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
