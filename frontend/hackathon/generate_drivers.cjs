const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// DRIVERS MODULE
// ==========================================

writeFile('pages/Drivers/Drivers.module.css', `
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

writeFile('pages/Drivers/components/DriverFilters.jsx', `
import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Drivers.module.css';

const DriverFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Name or License..." 
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
            { label: 'Off Duty', value: 'Off Duty' },
            { label: 'Suspended', value: 'Suspended' }
          ]}
        />
      </div>
    </div>
  );
};

export default DriverFilters;
`);

writeFile('pages/Drivers/components/DriverTable.jsx', `
import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/dateFormatter';
import { getStatusVariant } from '../../../utils/statusColors';

const DriverTable = ({ drivers }) => {
  const columns = [
    { header: 'Driver Name', accessor: 'name', render: (val) => <strong>{val}</strong> },
    { header: 'License No.', accessor: 'licenseNumber' },
    { header: 'Category', accessor: 'licenseCategory' },
    { 
      header: 'Expiry Date', 
      accessor: 'licenseExpiryDate', 
      render: (val) => {
        const isExpired = new Date(val) < new Date();
        return (
          <span style={{ color: isExpired ? 'var(--danger)' : 'inherit' }}>
            {formatDate(val)}
            {isExpired && ' (Expired)'}
          </span>
        );
      }
    },
    { header: 'Contact', accessor: 'contactNumber' },
    { 
      header: 'Safety Score', 
      accessor: 'safetyScore',
      render: (val) => {
        const color = val >= 90 ? 'var(--success)' : val >= 70 ? 'var(--warning)' : 'var(--danger)';
        return <span style={{ color, fontWeight: '600' }}>{val}/100</span>;
      }
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    }
  ];

  return <Table columns={columns} data={drivers} keyField="id" />;
};

export default DriverTable;
`);

writeFile('pages/Drivers/components/DriverForm.jsx', `
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
`);

writeFile('pages/Drivers/components/DriverModal.jsx', `
import React from 'react';
import Modal from '../../../components/ui/Modal';
import DriverForm from './DriverForm';

const DriverModal = ({ isOpen, onClose, onSubmit, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Driver">
      <DriverForm onSubmit={onSubmit} onCancel={onClose} loading={loading} />
    </Modal>
  );
};

export default DriverModal;
`);

writeFile('pages/Drivers/index.jsx', `
import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DriverFilters from './components/DriverFilters';
import DriverTable from './components/DriverTable';
import DriverModal from './components/DriverModal';
import styles from './Drivers.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { getDrivers, createDriver } from '../../services/drivers/driverService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Drivers = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { execute: fetchDrivers, data, loading, error } = useApi(getDrivers);
  const { execute: addDriver, loading: createLoading } = useApi(createDriver);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDrivers().catch(() => {});
  }, [fetchDrivers]);

  const canCreate = hasPermission(user?.role, PERMISSIONS.DRIVERS_CREATE);

  const handleCreateDriver = async (driverData) => {
    try {
      await addDriver(driverData);
      addNotification('Driver profile created successfully.', 'success');
      setIsModalOpen(false);
      fetchDrivers(); // Refresh the list
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to register driver.', 'error');
    }
  };

  // Filter Logic
  const filteredDrivers = useMemo(() => {
    if (!data) return [];
    return data.filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  if (loading && !data) {
    return <Loader text="Loading driver registry..." />;
  }

  return (
    <div>
      <PageHeader 
        title="Driver Management" 
        action={
          canCreate && (
            <Button variant="primary" icon="➕" onClick={() => setIsModalOpen(true)}>
              Add Driver
            </Button>
          )
        }
      />

      <Card>
        <div style={{ padding: '20px' }}>
          <div className={styles.toolbar}>
            <DriverFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
          
          {error && !data ? (
            <EmptyState icon="⚠️" title="Error Loading Drivers" description={error} />
          ) : filteredDrivers.length === 0 ? (
            <EmptyState 
              icon="🧑‍✈️" 
              title="No drivers found" 
              description="Adjust your search filters or register a new driver profile." 
            />
          ) : (
            <DriverTable drivers={filteredDrivers} />
          )}
        </div>
      </Card>

      <DriverModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDriver}
        loading={createLoading}
      />
    </div>
  );
};

export default Drivers;
`);

console.log("Drivers module generated successfully.");
