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
