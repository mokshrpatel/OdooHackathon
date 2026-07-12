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
