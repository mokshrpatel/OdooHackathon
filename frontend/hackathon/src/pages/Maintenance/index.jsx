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
import { getMaintenanceRecords, createMaintenanceRecord, closeMaintenanceRecord } from '../../services/maintenance/maintenanceService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Maintenance = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { execute: getRecords, data, loading, error } = useApi(getMaintenanceRecords);
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
              <div><strong>Warning:</strong> Failed to load maintenance logs. ({error})</div>
              <button 
                onClick={() => getRecords()}
                style={{ 
                  background: 'transparent', border: '1px solid var(--danger)', 
                  color: 'var(--danger)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {filteredRecords.length === 0 && (!error || data) ? (
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
        message={`Are you sure you want to close log #${activeRecord?.id}? This will restore Vehicle #${activeRecord?.vehicleId} to 'Available' status.`}
        confirmText="Close Log"
        variant="success"
        onConfirm={confirmClose}
      />
    </div>
  );
};

export default Maintenance;
