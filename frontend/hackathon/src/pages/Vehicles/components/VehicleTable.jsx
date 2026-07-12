import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { getStatusVariant } from '../../../utils/statusColors';

const VehicleTable = ({ vehicles }) => {
  const columns = [
    { header: 'Registration', accessor: 'registrationNumber', render: (val) => <strong>{val}</strong> },
    { header: 'Model', accessor: 'nameModel' },
    { header: 'Type', accessor: 'type' },
    { header: 'Capacity (kg)', accessor: 'maxLoadCapacity' },
    { header: 'Odometer (km)', accessor: 'odometer' },
    { header: 'Cost', accessor: 'acquisitionCost', render: (val) => formatCurrency(val) },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    }
  ];

  return <Table columns={columns} data={vehicles} keyField="id" />;
};

export default VehicleTable;
