import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getVehicles } from '../../../services/vehicles/vehicleService';
import styles from '../Expenses.module.css';

const GeneralExpenseForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    tripId: '',
    expenseType: 'Toll',
    amount: '',
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
        console.error('Failed to load resources');
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
      expenseType: { required: true },
      amount: { required: true, isPositive: true },
      date: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      vehicleId: Number(formData.vehicleId),
      amount: Number(formData.amount)
    };
    
    // Trip ID is optional but if provided it should be a number
    if (formData.tripId) {
      payload.tripId = Number(formData.tripId);
    } else {
      delete payload.tripId;
    }

    onSubmit(payload);
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
            label: `${v.registrationNumber}`, 
            value: v.id 
          }))}
        />
        
        <Input 
          label="Trip ID (Optional)" 
          name="tripId"
          type="number"
          placeholder="e.g. 101"
          value={formData.tripId}
          onChange={handleChange}
          error={errors.tripId}
          disabled={loading}
        />
        
        <Select 
          label="Expense Type" 
          name="expenseType"
          value={formData.expenseType}
          onChange={handleChange}
          error={errors.expenseType}
          disabled={loading}
          options={[
            { label: 'Toll', value: 'Toll' },
            { label: 'Parking', value: 'Parking' },
            { label: 'Fines', value: 'Fines' },
            { label: 'Other', value: 'Other' }
          ]}
        />
        
        <Input 
          label="Amount ($)" 
          name="amount"
          type="number"
          placeholder="e.g. 15.50"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          disabled={loading}
        />
        
        <Input 
          label="Date of Expense" 
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
          {loading ? 'Logging...' : 'Submit Expense Log'}
        </Button>
      </div>
    </form>
  );
};

export default GeneralExpenseForm;
