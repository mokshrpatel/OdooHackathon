const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// REPORTS MODULE
// ==========================================

writeFile('pages/Reports/Reports.module.css', `
.headerActions {
  display: flex;
  gap: 12px;
}

.chartContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
}

.barRow {
  display: flex;
  align-items: center;
  gap: 16px;
}

.barLabel {
  width: 120px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.barTrack {
  flex: 1;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.barFill {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  transition: width 1s ease-in-out;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 2fr;
  }
}

.summaryCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, var(--bg-surface) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: center;
}

.summaryValue {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 8px 0;
}

.summaryLabel {
  font-size: 0.875rem;
  color: var(--text-muted);
}
`);

writeFile('pages/Reports/components/ExportButtons.jsx', `
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

    const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv' });
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
`);

writeFile('pages/Reports/components/ReportCharts.jsx', `
import React from 'react';
import Card, { CardHeader, CardBody } from '../../../components/ui/Card';
import styles from '../Reports.module.css';

const ReportCharts = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Sort by ROI descending and take top 5
  const topPerformers = [...data].sort((a, b) => b.roiPercentage - a.roiPercentage).slice(0, 5);
  
  // Find max value to scale the bars relative to the highest ROI
  const maxRoi = Math.max(...topPerformers.map(d => Math.max(d.roiPercentage, 0.1)));

  return (
    <Card>
      <CardHeader title="Top 5 Vehicles by ROI" />
      <CardBody>
        <div className={styles.chartContainer}>
          {topPerformers.map(vehicle => {
            const isNegative = vehicle.roiPercentage < 0;
            // Cap visual width at 100%
            const widthPct = isNegative 
              ? 10 // Show a tiny bar for negative just to render the number inside or beside
              : Math.min((vehicle.roiPercentage / maxRoi) * 100, 100);
              
            const color = isNegative ? 'var(--danger)' : 'var(--success)';

            return (
              <div key={vehicle.vehicleId} className={styles.barRow}>
                <div className={styles.barLabel} title={vehicle.registrationNumber}>
                  {vehicle.registrationNumber}
                </div>
                <div className={styles.barTrack}>
                  <div 
                    className={styles.barFill} 
                    style={{ 
                      width: \`\${Math.max(widthPct, 15)}%\`, 
                      backgroundColor: color 
                    }}
                  >
                    {vehicle.roiPercentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ReportCharts;
`);

writeFile('pages/Reports/index.jsx', `
import React, { useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import ROITable from '../Dashboard/components/ROITable'; // Reusing the excellent table from Dashboard
import Card from '../../components/ui/Card';

import ExportButtons from './components/ExportButtons';
import ReportCharts from './components/ReportCharts';
import styles from './Reports.module.css';

import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import { getROI } from '../../services/reports/reportService';
import { formatCurrency } from '../../utils/currencyFormatter';
import { hasPermission, PERMISSIONS } from '../../utils/rolePermissions';

const Reports = () => {
  const { user } = useAuth();
  const { execute: fetchROI, data, loading, error } = useApi(getROI);

  useEffect(() => {
    fetchROI().catch(() => {});
  }, [fetchROI]);

  const canViewReports = hasPermission(user?.role, PERMISSIONS.REPORTS);

  // Aggregate metrics
  const aggregateMetrics = useMemo(() => {
    if (!data || data.length === 0) return { totalRev: 0, totalCost: 0, avgRoi: 0 };
    
    let rev = 0;
    let cost = 0;
    let totalRoi = 0;
    
    data.forEach(item => {
      rev += Number(item.totalRevenue || 0);
      cost += Number(item.operationalCost || 0);
      totalRoi += Number(item.roiPercentage || 0);
    });
    
    return {
      totalRev: rev,
      totalCost: cost,
      avgRoi: (totalRoi / data.length).toFixed(2)
    };
  }, [data]);

  if (!canViewReports) {
    return <EmptyState icon="🔒" title="Access Denied" description="You do not have permission to view financial reports." />;
  }

  if (loading && !data) return <Loader text="Generating financial reports..." />;

  if (error && !data) {
    return <EmptyState icon="⚠️" title="Error Loading Reports" description={error} />;
  }

  return (
    <div>
      <PageHeader 
        title="Financial & ROI Reports" 
        action={<ExportButtons data={data} />}
      />

      {(!data || data.length === 0) ? (
        <EmptyState 
          icon="📊" 
          title="No data available" 
          description="Insufficient trip or expense data to generate ROI reports." 
        />
      ) : (
        <>
          <div className={styles.grid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryLabel}>Average Fleet ROI</span>
                <span className={styles.summaryValue} style={{ color: aggregateMetrics.avgRoi >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {aggregateMetrics.avgRoi > 0 ? '+' : ''}{aggregateMetrics.avgRoi}%
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Card style={{ padding: '24px', textAlign: 'center' }}>
                  <span className={styles.summaryLabel}>Gross Revenue</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '8px' }}>
                    {formatCurrency(aggregateMetrics.totalRev)}
                  </div>
                </Card>
                <Card style={{ padding: '24px', textAlign: 'center' }}>
                  <span className={styles.summaryLabel}>Total Op. Costs</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '8px', color: 'var(--danger)' }}>
                    {formatCurrency(aggregateMetrics.totalCost)}
                  </div>
                </Card>
              </div>
            </div>
            
            <div>
              <ReportCharts data={data} />
            </div>
          </div>

          <ROITable roiData={data} loading={loading} />
        </>
      )}
    </div>
  );
};

export default Reports;
`);

console.log("Reports module generated successfully.");
