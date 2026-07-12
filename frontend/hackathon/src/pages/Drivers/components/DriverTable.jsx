import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../utils/dateFormatter';
import { getStatusVariant } from '../../../utils/statusColors';

const DriverTable = ({ drivers }) => {
  const columns = [
    { header: 'Driver Name', accessor: 'name', render: (val) => <strong>{val}</strong> },
    { header: 'License No.', accessor: 'licenseNumber' },
    { header: 'Category', accessor: 'licenseCategory' },
    { 
      header: 'Expiry Date', 
      accessor: 'licenseExpiryDate', 
      render: (val) => {
        const isExpired = new Date(val) < new Date();
        return (
          <span style={{ color: isExpired ? 'var(--danger)' : 'inherit' }}>
            {formatDate(val)}
            {isExpired && ' (Expired)'}
          </span>
        );
      }
    },
    { header: 'Contact', accessor: 'contactNumber' },
    { 
      header: 'Safety Score', 
      accessor: 'safetyScore',
      render: (val) => {
        const color = val >= 90 ? 'var(--success)' : val >= 70 ? 'var(--warning)' : 'var(--danger)';
        return <span style={{ color, fontWeight: '600' }}>{val}/100</span>;
      }
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    }
  ];

  return <Table columns={columns} data={drivers} keyField="id" />;
};

export default DriverTable;
