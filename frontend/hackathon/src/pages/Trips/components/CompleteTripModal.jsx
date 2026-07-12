import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import styles from '../Trips.module.css';

const CompleteTripModal = ({ isOpen, onClose, onSubmit, loading, trip }) => {
  const [formData, setFormData] = useState({
    finalOdometer: '',
    fuelConsumed: '',
    revenue: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen || !trip) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rules = {
      finalOdometer: { required: true, isPositive: true },
      fuelConsumed: { required: true, isPositive: true },
      revenue: { required: true, isPositive: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      finalOdometer: Number(formData.finalOdometer),
      fuelConsumed: Number(formData.fuelConsumed),
      revenue: Number(formData.revenue)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Complete Trip #${trip.id}`}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Please enter final metrics to close out this trip. The vehicle and driver will be returned to Available.
          </p>
          <Input 
            label="Final Odometer (km)" 
            name="finalOdometer"
            type="number"
            value={formData.finalOdometer}
            onChange={handleChange}
            error={errors.finalOdometer}
            disabled={loading}
          />
          <Input 
            label="Fuel Consumed (Liters)" 
            name="fuelConsumed"
            type="number"
            value={formData.fuelConsumed}
            onChange={handleChange}
            error={errors.fuelConsumed}
            disabled={loading}
          />
          <Input 
            label="Generated Revenue ($)" 
            name="revenue"
            type="number"
            value={formData.revenue}
            onChange={handleChange}
            error={errors.revenue}
            disabled={loading}
          />
        </div>
        <div className={styles.formActions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Trip'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompleteTripModal;
