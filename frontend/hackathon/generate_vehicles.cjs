const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// VEHICLES MODULE
// ==========================================

writeFile('pages/Vehicles/Vehicles.module.css', `
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 16px;
  flex: 1;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.formActions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}
`);

writeFile('pages/Vehicles/components/VehicleFilters.jsx', `
import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Vehicles.module.css';

const VehicleFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Registration or Model..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Available', value: 'Available' },
            { label: 'On Trip', value: 'On Trip' },
            { label: 'In Shop', value: 'In Shop' },
            { label: 'Retired', value: 'Retired' }
          ]}
        />
      </div>
    </div>
  );
};

export default VehicleFilters;
`);

writeFile('pages/Vehicles/components/VehicleTable.jsx', `
import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { getStatusVariant } from '../../../utils/statusColors';

const VehicleTable = ({ vehicles }) => {
  const columns = [
    { header: 'Registration', accessor: 'registrationNumber', render: (val) => <strong>{val}</strong> },
    { header: 'Model', accessor: 'nameModel' },
    { header: 'Type', accessor: 'type' },
    { header: 'Capacity (kg)', accessor: 'maxLoadCapacity' },
    { header: 'Odometer (km)', accessor: 'odometer' },
    { header: 'Cost', accessor: 'acquisitionCost', render: (val) => formatCurrency(val) },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    }
  ];

  return <Table columns={columns} data={vehicles} keyField="id" />;
};

export default VehicleTable;
`);

writeFile('pages/Vehicles/components/VehicleForm.jsx', `
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
`);

writeFile('pages/Vehicles/components/VehicleModal.jsx', `
import React from 'react';
import Modal from '../../../components/ui/Modal';
import VehicleForm from './VehicleForm';

const VehicleModal = ({ isOpen, onClose, onSubmit, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Vehicle">
      <VehicleForm onSubmit={onSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
};

export default VehicleModal;
`);

writeFile('pages/Vehicles/index.jsx', `
import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import VehicleFilters from './components/VehicleFilters';
import VehicleTable from './components/VehicleTable';
import VehicleModal from './components/VehicleModal';
import styles from './Vehicles.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { getVehicles, createVehicle } from '../../services/vehicles/vehicleService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Vehicles = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { execute: fetchVehicles, data, loading, error } = useApi(getVehicles);
  const { execute: addVehicle, loading: createLoading } = useApi(createVehicle);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVehicles().catch(() => {});
  }, [fetchVehicles]);

  const canCreate = hasPermission(user?.role, PERMISSIONS.VEHICLES_CREATE);

  const handleCreateVehicle = async (vehicleData) => {
    try {
      await addVehicle(vehicleData);
      addNotification('Vehicle registered successfully.', 'success');
      setIsModalOpen(false);
      fetchVehicles(); // Refresh the list
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to register vehicle.', 'error');
    }
  };

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    if (!data) return [];
    return data.filter(vehicle => {
      const matchesSearch = 
        vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        vehicle.nameModel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  if (loading && !data) {
    return <Loader text="Loading vehicle registry..." />;
  }

  return (
    <div>
      <PageHeader 
        title="Vehicle Registry" 
        action={
          canCreate && (
            <Button variant="primary" icon="➕" onClick={() => setIsModalOpen(true)}>
              Add Vehicle
            </Button>
          )
        }
      />

      <Card>
        <div style={{ padding: '20px' }}>
          <div className={styles.toolbar}>
            <VehicleFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
          
          {error && !data ? (
            <EmptyState icon="⚠️" title="Error Loading Vehicles" description={error} />
          ) : filteredVehicles.length === 0 ? (
            <EmptyState 
              icon="🚚" 
              title="No vehicles found" 
              description="Adjust your search filters or register a new vehicle." 
            />
          ) : (
            <VehicleTable vehicles={filteredVehicles} />
          )}
        </div>
      </Card>

      <VehicleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateVehicle}
        loading={createLoading}
      />
    </div>
  );
};

export default Vehicles;
`);

console.log("Vehicle Registry module generated successfully.");
