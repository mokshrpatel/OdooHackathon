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
          
          {error && !data && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderLeft: '4px solid var(--danger)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div><strong>Warning:</strong> Failed to load vehicles. ({error})</div>
              <button 
                onClick={() => fetchVehicles()}
                style={{ 
                  background: 'transparent', border: '1px solid var(--danger)', 
                  color: 'var(--danger)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {filteredVehicles.length === 0 && (!error || data) ? (
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
