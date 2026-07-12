import React from 'react';
import Button from '../../../components/ui/Button';
import styles from '../Reports.module.css';
import useNotification from '../../../hooks/useNotification';

const ExportButtons = ({ data }) => {
  const { addNotification } = useNotification();

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      addNotification('No data available to export.', 'warning');
      return;
    }

    const headers = ['Vehicle ID', 'Registration', 'Total Revenue', 'Operational Cost', 'Acquisition Cost', 'ROI %'];
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      csvRows.push([
        row.vehicleId,
        row.registrationNumber,
        row.totalRevenue,
        row.operationalCost,
        row.acquisitionCost,
        row.roiPercentage
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'TransitOps_ROI_Report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addNotification('Report exported successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.headerActions}>
      <Button variant="secondary" icon="🖨️" onClick={handlePrint}>Print</Button>
      <Button variant="primary" icon="📥" onClick={handleExportCSV}>Export CSV</Button>
    </div>
  );
};

export default ExportButtons;
