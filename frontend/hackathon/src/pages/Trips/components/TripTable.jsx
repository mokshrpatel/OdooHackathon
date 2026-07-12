import React from 'react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { getStatusVariant } from '../../../utils/statusColors';
import styles from '../Trips.module.css';

const TripTable = ({ trips, onAction, canDispatch }) => {
  const columns = [
    { header: 'Trip ID', accessor: 'id', render: (val) => <strong>#{val}</strong> },
    { header: 'Source', accessor: 'source' },
    { header: 'Destination', accessor: 'destination' },
    { header: 'Vehicle ID', accessor: 'vehicleId' },
    { header: 'Driver ID', accessor: 'driverId' },
    { header: 'Cargo (kg)', accessor: 'cargoWeight' },
    { header: 'Distance (km)', accessor: 'plannedDistance' },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (val) => <Badge variant={getStatusVariant(val)}>{val}</Badge>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id, row) => {
        if (!canDispatch) return <span style={{ color: 'var(--text-muted)' }}>Locked</span>;
        
        return (
          <div className={styles.actionGroup}>
            {row.status === 'Draft' && (
              <>
                <Button variant="primary" onClick={(e) => { e.stopPropagation(); onAction('dispatch', row); }}>Dispatch</Button>
                <Button variant="danger" onClick={(e) => { e.stopPropagation(); onAction('cancel', row); }}>Cancel</Button>
              </>
            )}
            {row.status === 'Dispatched' && (
              <Button variant="success" onClick={(e) => { e.stopPropagation(); onAction('complete', row); }} style={{ backgroundColor: 'var(--success)' }}>
                Complete
              </Button>
            )}
            {row.status === 'Completed' && <span style={{ color: 'var(--text-muted)' }}>Finished</span>}
            {row.status === 'Cancelled' && <span style={{ color: 'var(--text-muted)' }}>Archived</span>}
          </div>
        );
      }
    }
  ];

  return <Table columns={columns} data={trips} keyField="id" />;
};

export default TripTable;
