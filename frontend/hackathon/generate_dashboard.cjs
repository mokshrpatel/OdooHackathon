const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// DASHBOARD MODULE
// ==========================================

writeFile('pages/Dashboard/Dashboard.module.css', `
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.kpiCard {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.kpiHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.kpiIcon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background-color: rgba(255, 255, 255, 0.03);
}

.kpiValue {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1;
}

.progressContainer {
  margin-top: 16px;
}

.progressHeader {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.progressBar {
  height: 6px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 3px;
  transition: width 1s ease-in-out;
}

.sectionTitle {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-main);
}
`);

writeFile('pages/Dashboard/components/KPICards.jsx', `
import React from 'react';
import styles from '../Dashboard.module.css';

const KPICard = ({ title, value, icon, progress, progressColor = 'var(--primary)' }) => (
  <div className={styles.kpiCard}>
    <div className={styles.kpiHeader}>
      <span>{title}</span>
      <div className={styles.kpiIcon}>{icon}</div>
    </div>
    <div className={styles.kpiValue}>{value ?? 0}</div>
    
    {progress !== undefined && (
      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>Utilization</span>
          <span>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: \`\${progress}%\`, backgroundColor: progressColor }}
          />
        </div>
      </div>
    )}
  </div>
);

const KPICards = ({ kpis }) => {
  if (!kpis) return null;

  return (
    <div className={styles.grid}>
      <KPICard 
        title="Fleet Utilization" 
        value={\`\${kpis.fleetUtilizationPercentage || 0}%\`} 
        icon="📈" 
        progress={kpis.fleetUtilizationPercentage || 0} 
      />
      <KPICard 
        title="Active Vehicles" 
        value={kpis.activeVehicles} 
        icon="🚚" 
      />
      <KPICard 
        title="Available Vehicles" 
        value={kpis.availableVehicles} 
        icon="✅" 
      />
      <KPICard 
        title="In Maintenance" 
        value={kpis.vehiclesInMaintenance} 
        icon="🔧" 
        progressColor="var(--warning)"
      />
      <KPICard 
        title="Active Trips" 
        value={kpis.activeTrips} 
        icon="📍" 
      />
      <KPICard 
        title="Drivers On Duty" 
        value={kpis.driversOnDuty} 
        icon="🧑‍✈️" 
      />
    </div>
  );
};

export default KPICards;
`);

writeFile('pages/Dashboard/components/ROITable.jsx', `
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
`);

writeFile('pages/Dashboard/index.jsx', `
import React, { useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/common/EmptyState';
import KPICards from './components/KPICards';
import ROITable from './components/ROITable';
import useApi from '../../hooks/useApi';
import { getKPIs } from '../../services/dashboard/dashboardService';
import { getROI } from '../../services/reports/reportService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { execute: fetchKPIs, data: kpiData, loading: kpiLoading, error: kpiError } = useApi(getKPIs);
  const { execute: fetchROI, data: roiData, loading: roiLoading, error: roiError } = useApi(getROI);

  useEffect(() => {
    // Fire API calls on mount
    fetchKPIs().catch(console.error);
    fetchROI().catch(console.error);
  }, [fetchKPIs, fetchROI]);

  const isLoading = kpiLoading && !kpiData;

  if (isLoading) {
    return <Loader fullPage={false} text="Gathering operational metrics..." />;
  }

  const hasError = kpiError || roiError;
  if (hasError && !kpiData) {
    return <EmptyState icon="⚠️" title="Failed to load dashboard" description={hasError} />;
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard Overview" 
        action={<span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Live Metrics</span>}
      />
      
      <KPICards kpis={kpiData} />
      
      <div className={styles.sectionTitle}>Financial Performance</div>
      <ROITable roiData={roiData} loading={roiLoading} />
    </div>
  );
};

export default Dashboard;
`);

console.log("Dashboard module generated successfully.");
