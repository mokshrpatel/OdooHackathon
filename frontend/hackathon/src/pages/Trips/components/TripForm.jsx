import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getAvailableVehicles } from '../../../services/vehicles/vehicleService';
import { getAvailableDrivers } from '../../../services/drivers/driverService';
import styles from '../Trips.module.css';

const TripForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    source: '',
    destination: '',
    cargoWeight: '',
    plannedDistance: ''
  });
  
  const [errors, setErrors] = useState({});
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    // Fetch available resources when modal opens
    const fetchResources = async () => {
      try {
        const [vehRes, drvRes] = await Promise.all([
          getAvailableVehicles(),
          getAvailableDrivers()
        ]);
        
        // Handle response mapping
        const vData = vehRes.data || vehRes;
        const dData = drvRes.data || drvRes;
        
        setAvailableVehicles(Array.isArray(vData) ? vData : []);
        setAvailableDrivers(Array.isArray(dData) ? dData : []);
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
      driverId: { required: true },
      source: { required: true },
      destination: { required: true },
      cargoWeight: { required: true, isPositive: true },
      plannedDistance: { required: true, isPositive: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      vehicleId: Number(formData.vehicleId),
      driverId: Number(formData.driverId),
      cargoWeight: Number(formData.cargoWeight),
      plannedDistance: Number(formData.plannedDistance)
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Input 
          label="Source Location" 
          name="source"
          placeholder="e.g. Warehouse A"
          value={formData.source}
          onChange={handleChange}
          error={errors.source}
          disabled={loading || loadingOptions}
        />
        <Input 
          label="Destination" 
          name="destination"
          placeholder="e.g. Store B"
          value={formData.destination}
          onChange={handleChange}
          error={errors.destination}
          disabled={loading || loadingOptions}
        />
        
        <Select 
          label="Assign Available Vehicle" 
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          error={errors.vehicleId}
          disabled={loading || loadingOptions}
          options={availableVehicles.map(v => ({ 
            label: `${v.registrationNumber} (${v.maxLoadCapacity}kg cap)`, 
            value: v.id 
          }))}
        />
        
        <Select 
          label="Assign Available Driver" 
          name="driverId"
          value={formData.driverId}
          onChange={handleChange}
          error={errors.driverId}
          disabled={loading || loadingOptions}
          options={availableDrivers.map(d => ({ 
            label: `${d.name} (${d.licenseCategory})`, 
            value: d.id 
          }))}
        />
        
        <Input 
          label="Cargo Weight (kg)" 
          name="cargoWeight"
          type="number"
          placeholder="e.g. 450"
          value={formData.cargoWeight}
          onChange={handleChange}
          error={errors.cargoWeight}
          disabled={loading || loadingOptions}
        />
        
        <Input 
          label="Planned Distance (km)" 
          name="plannedDistance"
          type="number"
          placeholder="e.g. 120"
          value={formData.plannedDistance}
          onChange={handleChange}
          error={errors.plannedDistance}
          disabled={loading || loadingOptions}
        />
      </div>
      
      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading || loadingOptions}>
          {loading ? 'Creating...' : 'Create Draft Trip'}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
