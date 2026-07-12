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
              <div><strong>Warning:</strong> Failed to load drivers. ({error})</div>
              <button 
                onClick={() => fetchDrivers()}
                style={{ 
                  background: 'transparent', border: '1px solid var(--danger)', 
                  color: 'var(--danger)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {filteredDrivers.length === 0 && (!error || data) ? (
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
