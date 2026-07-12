import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/dateFormatter';
import { formatCurrency } from '../../../utils/currencyFormatter';

const ExpenseTable = ({ expenses }) => {
  const columns = [
    { header: 'ID', accessor: 'id', render: (val) => <strong>#{val}</strong> },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Trip ID', accessor: 'tripId', render: (val) => val ? `#${val}` : '-' },
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
    { header: 'Details (Liters)', accessor: 'liters', render: (val) => val ? `${val} L` : '-' }
  ];

  return <Table columns={columns} data={expenses} keyField="id" />;
};

export default ExpenseTable;
