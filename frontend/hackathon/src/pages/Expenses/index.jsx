import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../services/axiosInstance';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import FuelLogForm from './components/FuelLogForm';
import GeneralExpenseForm from './components/GeneralExpenseForm';
import styles from './Expenses.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { recordFuelLog } from '../../services/expenses/fuelService';
import { getAllExpenses, logExpense as recordGeneralExpense } from '../../services/expenses/expenseService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Expenses = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const { execute: getRecords, data, loading, error } = useApi(getAllExpenses);
  const { execute: submitFuel, loading: fuelLoading } = useApi(recordFuelLog);
  const { execute: submitGeneral, loading: generalLoading } = useApi(recordGeneralExpense);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const [modalMode, setModalMode] = useState(null); // 'fuel' | 'general' | null

  useEffect(() => {
    getRecords().catch(() => {});
  }, [getRecords]);

  const canManage = hasPermission(user?.role, PERMISSIONS.EXPENSES);

  const handleFuelSubmit = async (formData) => {
    try {
      await submitFuel(formData);
      addNotification('Fuel log recorded successfully.', 'success');
      setModalMode(null);
      getRecords();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to record fuel log.', 'error');
    }
  };
  
  const handleGeneralSubmit = async (formData) => {
    try {
      await submitGeneral(formData);
      addNotification('General expense recorded successfully.', 'success');
      setModalMode(null);
      getRecords();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to record general expense.', 'error');
    }
  };

  const filteredRecords = useMemo(() => {
    if (!data) return [];
    return data.filter(record => {
      // Safe string conversion for IDs
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = 
        (record.vehicleId && record.vehicleId.toString().includes(searchStr)) || 
        (record.tripId && record.tripId.toString().includes(searchStr));
        
      const matchesType = typeFilter === 'All' || record.expenseType === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, typeFilter]);

  if (loading && !data) return <Loader text="Loading financial records..." />;

  return (
    <div>
      <PageHeader 
        title="Fuel & Expenses" 
        action={
          canManage && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" icon="🧾" onClick={() => setModalMode('general')}>
                Log General Expense
              </Button>
              <Button variant="primary" icon="⛽" onClick={() => setModalMode('fuel')}>
                Log Fuel Fill-up
              </Button>
            </div>
          )
        }
      />

      <Card>
        <div style={{ padding: '20px' }}>
          <div className={styles.toolbar}>
            <ExpenseFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
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
              <div><strong>Warning:</strong> Failed to load expenses. ({error})</div>
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
              icon="💳" 
              title="No expense logs found" 
              description="Adjust filters or record a new fuel/general expense." 
            />
          ) : (
            <ExpenseTable expenses={filteredRecords} />
          )}
        </div>
      </Card>

      <Modal isOpen={modalMode === 'fuel'} onClose={() => setModalMode(null)} title="Record Fuel Fill-up">
        <FuelLogForm onSubmit={handleFuelSubmit} onCancel={() => setModalMode(null)} loading={fuelLoading} />
      </Modal>

      <Modal isOpen={modalMode === 'general'} onClose={() => setModalMode(null)} title="Record General Expense">
        <GeneralExpenseForm onSubmit={handleGeneralSubmit} onCancel={() => setModalMode(null)} loading={generalLoading} />
      </Modal>
    </div>
  );
};

export default Expenses;
