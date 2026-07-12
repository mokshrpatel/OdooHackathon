const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// MAINTENANCE MODULE
// ==========================================

writeFile('pages/Maintenance/Maintenance.module.css', `
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
  display: flex;
  flex-direction: column;
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

writeFile('pages/Maintenance/components/MaintenanceFilters.jsx', `
import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Maintenance.module.css';

const MaintenanceFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Description..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Active', value: 'Active' },
            { label: 'Closed', value: 'Closed' }
          ]}
        />
      </div>
    </div>
  );
};

export default MaintenanceFilters;
`);

writeFile('pages/Maintenance/components/MaintenanceTable.jsx', `
import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/dateFormatter';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { getStatusVariant } from '../../../utils/statusColors';

const MaintenanceTable = ({ records, onAction, canManage }) => {
  const columns = [
    { header: 'ID', accessor: 'id', render: (val) => <strong>#{val}</strong> },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Description', accessor: 'description' },
    { header: 'Cost', accessor: 'cost', render: (val) => formatCurrency(val) },
    { header: 'Date Logged', accessor: 'createdAt', render: (val) => formatDate(val, true) },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => {
        if (!canManage) return <span style={{ color: 'var(--text-muted)' }}>Locked</span>;
        
        if (row.status === 'Active') {
          return (
            <Button 
              variant="success" 
              onClick={(e) => { e.stopPropagation(); onAction(row); }}
              style={{ backgroundColor: 'var(--success)' }}
            >
              Close Log
            </Button>
          );
        }
        
        return <span style={{ color: 'var(--text-muted)' }}>Resolved</span>;
      }
    }
  ];

  return <Table columns={columns} data={records} keyField="id" />;
};

export default MaintenanceTable;
`);

writeFile('pages/Maintenance/components/MaintenanceForm.jsx', `
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
            label: \`\${v.registrationNumber} - \${v.nameModel}\`, 
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
`);

writeFile('pages/Maintenance/index.jsx', `
import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../services/axiosInstance';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

import MaintenanceFilters from './components/MaintenanceFilters';
import MaintenanceTable from './components/MaintenanceTable';
import MaintenanceForm from './components/MaintenanceForm';
import styles from './Maintenance.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { createMaintenanceRecord, closeMaintenanceRecord } from '../../services/maintenance/maintenanceService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Maintenance = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Custom fetch function since maintenance requires its own GET API
  const fetchAllMaintenance = async () => {
    return await axiosInstance.get('/maintenance');
  };
  
  const { execute: getRecords, data, loading, error } = useApi(fetchAllMaintenance);
  const { execute: callCreate, loading: createLoading } = useApi(createMaintenanceRecord);
  const { execute: callClose } = useApi(closeMaintenanceRecord);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);

  useEffect(() => {
    getRecords().catch(() => {});
  }, [getRecords]);

  const canManage = hasPermission(user?.role, PERMISSIONS.MAINTENANCE);

  const handleCreate = async (recordData) => {
    try {
      await callCreate(recordData);
      addNotification('Maintenance log created. Vehicle moved to In Shop.', 'success');
      setIsCreateOpen(false);
      getRecords();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to create log.', 'error');
    }
  };

  const confirmClose = async () => {
    try {
      await callClose(activeRecord.id);
      addNotification('Maintenance log closed. Vehicle is now Available.', 'success');
      getRecords();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to close log.', 'error');
    }
    setActiveRecord(null);
  };

  const filteredRecords = useMemo(() => {
    if (!data) return [];
    return data.filter(record => {
      const matchesSearch = record.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  if (loading && !data) return <Loader text="Loading maintenance logs..." />;

  return (
    <div>
      <PageHeader 
        title="Fleet Maintenance" 
        action={
          canManage && (
            <Button variant="primary" icon="🔧" onClick={() => setIsCreateOpen(true)}>
              Log Maintenance
            </Button>
          )
        }
      />

      <Card>
        <div style={{ padding: '20px' }}>
          <div className={styles.toolbar}>
            <MaintenanceFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
          
          {error && !data ? (
            <EmptyState icon="⚠️" title="Error Loading Logs" description={error} />
          ) : filteredRecords.length === 0 ? (
            <EmptyState 
              icon="📋" 
              title="No records found" 
              description="Adjust filters or open a new maintenance record." 
            />
          ) : (
            <MaintenanceTable records={filteredRecords} onAction={setActiveRecord} canManage={canManage} />
          )}
        </div>
      </Card>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Open Maintenance Record">
        <MaintenanceForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} loading={createLoading} />
      </Modal>

      <ConfirmationDialog 
        isOpen={!!activeRecord}
        onClose={() => setActiveRecord(null)}
        title="Close Maintenance Log"
        message={\`Are you sure you want to close log #\${activeRecord?.id}? This will restore Vehicle #\${activeRecord?.vehicleId} to 'Available' status.\`}
        confirmText="Close Log"
        variant="success"
        onConfirm={confirmClose}
      />
    </div>
  );
};

export default Maintenance;
`);

console.log("Maintenance module generated successfully.");
