import React from 'react';
import Table from '../../../components/ui/Table';
import Card, { CardHeader, CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/currencyFormatter';

const ROITable = ({ roiData, loading }) => {
  const columns = [
    { header: 'Registration', accessor: 'registrationNumber', render: (val) => <strong>{val}</strong> },
    { header: 'Total Revenue', accessor: 'totalRevenue', render: (val) => formatCurrency(val) },
    { header: 'Op. Cost', accessor: 'operationalCost', render: (val) => <span style={{ color: 'var(--danger)' }}>-{formatCurrency(val)}</span> },
    { header: 'Acquisition', accessor: 'acquisitionCost', render: (val) => formatCurrency(val) },
    { 
      header: 'ROI', 
      accessor: 'roiPercentage', 
      render: (val) => {
        const isPositive = val >= 0;
        return (
          <Badge variant={isPositive ? 'success' : 'danger'}>
            {isPositive ? '+' : ''}{val}%
          </Badge>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader title="Vehicle ROI Performance" />
      <CardBody style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading ROI Data...</div>
        ) : (
          <Table columns={columns} data={roiData || []} keyField="vehicleId" />
        )}
      </CardBody>
    </Card>
  );
};

export default ROITable;
