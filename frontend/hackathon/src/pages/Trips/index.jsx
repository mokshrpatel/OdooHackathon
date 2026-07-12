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
import { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } from '../../services/trips/tripService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Trips = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { execute: fetchTripsData, data, loading, error } = useApi(getTrips);
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
    fetchTripsData().catch(() => {});
  }, [fetchTripsData]);

  const canManage = hasPermission(user?.role, PERMISSIONS.TRIPS);

  const handleCreate = async (tripData) => {
    try {
      await callCreate(tripData);
      addNotification('Draft trip created successfully.', 'success');
      setIsCreateOpen(false);
      fetchTripsData();
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
      fetchTripsData();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to dispatch trip.', 'error');
    }
    setActiveTrip(null);
  };

  const confirmCancel = async () => {
    try {
      await callCancel(activeTrip.id);
      addNotification('Trip cancelled successfully.', 'success');
      fetchTripsData();
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
      fetchTripsData();
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
              <div><strong>Warning:</strong> Failed to load trips. ({error})</div>
              <button 
                onClick={() => fetchTripsData()}
                style={{ 
                  background: 'transparent', border: '1px solid var(--danger)', 
                  color: 'var(--danger)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {filteredTrips.length === 0 && (!error || data) ? (
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
        message={`Are you sure you want to cancel Trip #${activeTrip?.id}? This will restore the vehicle and driver to Available status.`}
        confirmText="Cancel Trip"
        variant="danger"
        onConfirm={confirmCancel}
      />

      <ConfirmationDialog 
        isOpen={actionType === 'dispatch' && !!activeTrip}
        onClose={() => setActiveTrip(null)}
        title="Dispatch Trip"
        message={`Are you sure you want to dispatch Trip #${activeTrip?.id}? This will immediately mark the vehicle and driver as On Trip.`}
        confirmText="Dispatch Now"
        variant="primary"
        onConfirm={confirmDispatch}
      />
    </div>
  );
};

export default Trips;
