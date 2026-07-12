const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// TRIPS MODULE
// ==========================================

writeFile('pages/Trips/Trips.module.css', `
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

.actionGroup {
  display: flex;
  gap: 8px;
  align-items: center;
}
`);

writeFile('pages/Trips/components/TripFilters.jsx', `
import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Trips.module.css';

const TripFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Destination..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Dispatched', value: 'Dispatched' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]}
        />
      </div>
    </div>
  );
};

export default TripFilters;
`);

writeFile('pages/Trips/components/TripTable.jsx', `
import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { getStatusVariant } from '../../../utils/statusColors';
import styles from '../Trips.module.css';

const TripTable = ({ trips, onAction, canDispatch }) => {
  const columns = [
    { header: 'Trip ID', accessor: 'id', render: (val) => <strong>#{val}</strong> },
    { header: 'Source', accessor: 'source' },
    { header: 'Destination', accessor: 'destination' },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Driver ID', accessor: 'driverId' },
    { header: 'Cargo (kg)', accessor: 'cargoWeight' },
    { header: 'Distance (km)', accessor: 'plannedDistance' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => {
        if (!canDispatch) return <span style={{ color: 'var(--text-muted)' }}>Locked</span>;
        
        return (
          <div className={styles.actionGroup}>
            {row.status === 'Draft' && (
              <>
                <Button variant="primary" onClick={(e) => { e.stopPropagation(); onAction('dispatch', row); }}>Dispatch</Button>
                <Button variant="danger" onClick={(e) => { e.stopPropagation(); onAction('cancel', row); }}>Cancel</Button>
              </>
            )}
            {row.status === 'Dispatched' && (
              <Button variant="success" onClick={(e) => { e.stopPropagation(); onAction('complete', row); }} style={{ backgroundColor: 'var(--success)' }}>
                Complete
              </Button>
            )}
            {row.status === 'Completed' && <span style={{ color: 'var(--text-muted)' }}>Finished</span>}
            {row.status === 'Cancelled' && <span style={{ color: 'var(--text-muted)' }}>Archived</span>}
          </div>
        );
      }
    }
  ];

  return <Table columns={columns} data={trips} keyField="id" />;
};

export default TripTable;
`);

writeFile('pages/Trips/components/TripForm.jsx', `
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
            label: \`\${v.registrationNumber} (\${v.maxLoadCapacity}kg cap)\`, 
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
            label: \`\${d.name} (\${d.licenseCategory})\`, 
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
`);

writeFile('pages/Trips/components/CompleteTripModal.jsx', `
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
    <Modal isOpen={isOpen} onClose={onClose} title={\`Complete Trip #\${trip.id}\`}>
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
`);


writeFile('pages/Trips/index.jsx', `
import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../services/axiosInstance';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

import TripFilters from './components/TripFilters';
import TripTable from './components/TripTable';
import TripForm from './components/TripForm';
import CompleteTripModal from './components/CompleteTripModal';
import styles from './Trips.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { createTrip, dispatchTrip, completeTrip, cancelTrip } from '../../services/trips/tripService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Trips = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Custom fetch function since trips requires its own GET API which was missing in API docs but necessary for the page.
  // We will assume GET /api/trips exists, standard REST pattern.
  const fetchAllTrips = async () => {
    return await axiosInstance.get('/trips');
  };
  
  const { execute: getTrips, data, loading, error } = useApi(fetchAllTrips);
  const { execute: callCreate, loading: createLoading } = useApi(createTrip);
  const { execute: callDispatch } = useApi(dispatchTrip);
  const { execute: callCancel } = useApi(cancelTrip);
  const { execute: callComplete, loading: completeLoading } = useApi(completeTrip);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [actionType, setActionType] = useState(null); // 'cancel' or 'dispatch' or 'complete'

  useEffect(() => {
    getTrips().catch(() => {});
  }, [getTrips]);

  const canManage = hasPermission(user?.role, PERMISSIONS.TRIPS);

  const handleCreate = async (tripData) => {
    try {
      await callCreate(tripData);
      addNotification('Draft trip created successfully.', 'success');
      setIsCreateOpen(false);
      getTrips();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to create trip.', 'error');
    }
  };

  const handleAction = (type, trip) => {
    setActiveTrip(trip);
    setActionType(type);
  };

  const confirmDispatch = async () => {
    try {
      await callDispatch(activeTrip.id);
      addNotification('Trip successfully dispatched.', 'success');
      getTrips();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to dispatch trip.', 'error');
    }
    setActiveTrip(null);
  };

  const confirmCancel = async () => {
    try {
      await callCancel(activeTrip.id);
      addNotification('Trip cancelled successfully.', 'success');
      getTrips();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to cancel trip.', 'error');
    }
    setActiveTrip(null);
  };

  const handleComplete = async (metrics) => {
    try {
      await callComplete(activeTrip.id, metrics);
      addNotification('Trip successfully completed.', 'success');
      setActiveTrip(null);
      getTrips();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to complete trip.', 'error');
    }
  };

  const filteredTrips = useMemo(() => {
    if (!data) return [];
    return data.filter(trip => {
      const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  if (loading && !data) return <Loader text="Loading trips..." />;

  return (
    <div>
      <PageHeader 
        title="Trip Dispatch Board" 
        action={
          canManage && (
            <Button variant="primary" icon="➕" onClick={() => setIsCreateOpen(true)}>
              Create Trip
            </Button>
          )
        }
      />

      <Card>
        <div style={{ padding: '20px' }}>
          <div className={styles.toolbar}>
            <TripFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
          
          {error && !data ? (
            <EmptyState icon="⚠️" title="Error Loading Trips" description={error} />
          ) : filteredTrips.length === 0 ? (
            <EmptyState 
              icon="📍" 
              title="No trips found" 
              description="Adjust your search filters or create a new trip." 
            />
          ) : (
            <TripTable trips={filteredTrips} onAction={handleAction} canDispatch={canManage} />
          )}
        </div>
      </Card>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Trip">
        <TripForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} loading={createLoading} />
      </Modal>

      <CompleteTripModal 
        isOpen={actionType === 'complete' && !!activeTrip}
        onClose={() => setActiveTrip(null)}
        trip={activeTrip}
        onSubmit={handleComplete}
        loading={completeLoading}
      />

      <ConfirmationDialog 
        isOpen={actionType === 'cancel' && !!activeTrip}
        onClose={() => setActiveTrip(null)}
        title="Cancel Trip"
        message={\`Are you sure you want to cancel Trip #\${activeTrip?.id}? This will restore the vehicle and driver to Available status.\`}
        confirmText="Cancel Trip"
        variant="danger"
        onConfirm={confirmCancel}
      />

      <ConfirmationDialog 
        isOpen={actionType === 'dispatch' && !!activeTrip}
        onClose={() => setActiveTrip(null)}
        title="Dispatch Trip"
        message={\`Are you sure you want to dispatch Trip #\${activeTrip?.id}? This will immediately mark the vehicle and driver as On Trip.\`}
        confirmText="Dispatch Now"
        variant="primary"
        onConfirm={confirmDispatch}
      />
    </div>
  );
};

export default Trips;
`);

console.log("Trips module generated successfully.");
