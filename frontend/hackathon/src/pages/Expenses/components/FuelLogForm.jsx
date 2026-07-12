import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getVehicles } from '../../../services/vehicles/vehicleService';
import styles from '../Expenses.module.css';

const FuelLogForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const vehRes = await getVehicles();
        const vData = vehRes.data || vehRes;
        setVehicles(Array.isArray(vData) ? vData : []);
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
      liters: { required: true, isPositive: true },
      cost: { required: true, isPositive: true },
      date: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      liters: Number(formData.liters),
      cost: Number(formData.cost),
      date: formData.date
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Select 
          label="Select Vehicle" 
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          error={errors.vehicleId}
          disabled={loading || loadingOptions}
          options={vehicles.map(v => ({ 
            label: `${v.registrationNumber} - ${v.nameModel}`, 
            value: v.id 
          }))}
        />
        
        <Input 
          label="Fuel Filled (Liters)" 
          name="liters"
          type="number"
          placeholder="e.g. 40.00"
          value={formData.liters}
          onChange={handleChange}
          error={errors.liters}
          disabled={loading}
        />
        
        <Input 
          label="Total Cost ($)" 
          name="cost"
          type="number"
          placeholder="e.g. 65.00"
          value={formData.cost}
          onChange={handleChange}
          error={errors.cost}
          disabled={loading}
        />
        
        <Input 
          label="Date of Fill-up" 
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          disabled={loading}
        />
      </div>

      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading || loadingOptions}>
          {loading ? 'Logging...' : 'Submit Fuel Log'}
        </Button>
      </div>
    </form>
  );
};

export default FuelLogForm;
