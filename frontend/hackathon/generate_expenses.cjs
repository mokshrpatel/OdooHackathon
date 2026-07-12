const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// EXPENSES MODULE
// ==========================================

writeFile('pages/Expenses/Expenses.module.css', `
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

writeFile('pages/Expenses/components/ExpenseFilters.jsx', `
import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Expenses.module.css';

const ExpenseFilters = ({ searchQuery, onSearchChange, typeFilter, onTypeChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Vehicle ID or Trip ID..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          options={[
            { label: 'All Expenses', value: 'All' },
            { label: 'Fuel', value: 'Fuel' },
            { label: 'Toll', value: 'Toll' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Other', value: 'Other' }
          ]}
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;
`);

writeFile('pages/Expenses/components/ExpenseTable.jsx', `
import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/dateFormatter';
import { formatCurrency } from '../../../utils/currencyFormatter';

const ExpenseTable = ({ expenses }) => {
  const columns = [
    { header: 'ID', accessor: 'id', render: (val) => <strong>#{val}</strong> },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Trip ID', accessor: 'tripId', render: (val) => val ? \`#\${val}\` : '-' },
    { 
      header: 'Expense Type', 
      accessor: 'expenseType',
      render: (val) => {
        let variant = 'neutral';
        if (val === 'Fuel') variant = 'info';
        if (val === 'Maintenance') variant = 'warning';
        return <Badge variant={variant}>{val}</Badge>;
      }
    },
    { 
      header: 'Amount', 
      accessor: 'amount', 
      render: (val) => <span style={{ color: 'var(--danger)', fontWeight: '600' }}>-{formatCurrency(val)}</span> 
    },
    { header: 'Date', accessor: 'date', render: (val) => formatDate(val) },
    { header: 'Details (Liters)', accessor: 'liters', render: (val) => val ? \`\${val} L\` : '-' }
  ];

  return <Table columns={columns} data={expenses} keyField="id" />;
};

export default ExpenseTable;
`);

writeFile('pages/Expenses/components/FuelLogForm.jsx', `
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getVehicles } from '../../../services/vehicles/vehicleService';
import styles from '../Expenses.module.css';

const FuelLogForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const vehRes = await getVehicles();
        const vData = vehRes.data || vehRes;
        setVehicles(Array.isArray(vData) ? vData : []);
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
      liters: { required: true, isPositive: true },
      cost: { required: true, isPositive: true },
      date: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      vehicleId: Number(formData.vehicleId),
      liters: Number(formData.liters),
      cost: Number(formData.cost),
      date: formData.date
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Select 
          label="Select Vehicle" 
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          error={errors.vehicleId}
          disabled={loading || loadingOptions}
          options={vehicles.map(v => ({ 
            label: \`\${v.registrationNumber} - \${v.nameModel}\`, 
            value: v.id 
          }))}
        />
        
        <Input 
          label="Fuel Filled (Liters)" 
          name="liters"
          type="number"
          placeholder="e.g. 40.00"
          value={formData.liters}
          onChange={handleChange}
          error={errors.liters}
          disabled={loading}
        />
        
        <Input 
          label="Total Cost ($)" 
          name="cost"
          type="number"
          placeholder="e.g. 65.00"
          value={formData.cost}
          onChange={handleChange}
          error={errors.cost}
          disabled={loading}
        />
        
        <Input 
          label="Date of Fill-up" 
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          disabled={loading}
        />
      </div>

      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading || loadingOptions}>
          {loading ? 'Logging...' : 'Submit Fuel Log'}
        </Button>
      </div>
    </form>
  );
};

export default FuelLogForm;
`);

writeFile('pages/Expenses/components/GeneralExpenseForm.jsx', `
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { validateForm } from '../../../utils/validation';
import { getVehicles } from '../../../services/vehicles/vehicleService';
import styles from '../Expenses.module.css';

const GeneralExpenseForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    tripId: '',
    expenseType: 'Toll',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const vehRes = await getVehicles();
        const vData = vehRes.data || vehRes;
        setVehicles(Array.isArray(vData) ? vData : []);
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
      expenseType: { required: true },
      amount: { required: true, isPositive: true },
      date: { required: true }
    };

    const validationErrors = validateForm(formData, rules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      vehicleId: Number(formData.vehicleId),
      amount: Number(formData.amount)
    };
    
    // Trip ID is optional but if provided it should be a number
    if (formData.tripId) {
      payload.tripId = Number(formData.tripId);
    } else {
      delete payload.tripId;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <Select 
          label="Select Vehicle" 
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          error={errors.vehicleId}
          disabled={loading || loadingOptions}
          options={vehicles.map(v => ({ 
            label: \`\${v.registrationNumber}\`, 
            value: v.id 
          }))}
        />
        
        <Input 
          label="Trip ID (Optional)" 
          name="tripId"
          type="number"
          placeholder="e.g. 101"
          value={formData.tripId}
          onChange={handleChange}
          error={errors.tripId}
          disabled={loading}
        />
        
        <Select 
          label="Expense Type" 
          name="expenseType"
          value={formData.expenseType}
          onChange={handleChange}
          error={errors.expenseType}
          disabled={loading}
          options={[
            { label: 'Toll', value: 'Toll' },
            { label: 'Parking', value: 'Parking' },
            { label: 'Fines', value: 'Fines' },
            { label: 'Other', value: 'Other' }
          ]}
        />
        
        <Input 
          label="Amount ($)" 
          name="amount"
          type="number"
          placeholder="e.g. 15.50"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          disabled={loading}
        />
        
        <Input 
          label="Date of Expense" 
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          disabled={loading}
        />
      </div>

      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading || loadingOptions}>
          {loading ? 'Logging...' : 'Submit Expense Log'}
        </Button>
      </div>
    </form>
  );
};

export default GeneralExpenseForm;
`);

writeFile('pages/Expenses/index.jsx', `
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
import { recordGeneralExpense } from '../../services/expenses/expenseService';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Expenses = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  // Custom fetch function to retrieve all expenses
  const fetchAllExpenses = async () => {
    // In a real scenario, the backend would combine fuel and general expenses or provide an aggregate endpoint
    return await axiosInstance.get('/expenses');
  };
  
  const { execute: getRecords, data, loading, error } = useApi(fetchAllExpenses);
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
          
          {error && !data ? (
            <EmptyState icon="⚠️" title="Error Loading Expenses" description={error} />
          ) : filteredRecords.length === 0 ? (
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
`);

console.log("Fuel and Expenses module generated successfully.");
