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

  return (
    <div>
      <PageHeader 
        title="Dashboard Overview" 
        action={<span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Live Metrics</span>}
      />

      {hasError && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderLeft: '4px solid var(--danger)',
          color: 'var(--danger)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div><strong>Warning:</strong> Some metrics failed to load. Displaying cached or partial data where possible. ({hasError})</div>
          <button 
            onClick={() => { fetchKPIs(); fetchROI(); }}
            style={{ 
              background: 'transparent', border: '1px solid var(--danger)', 
              color: 'var(--danger)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      <KPICards kpis={kpiData} />
      
      <div className={styles.sectionTitle}>Financial Performance</div>
      
      <ROITable roiData={roiData} loading={roiLoading} />
    </div>
  );
};

export default Dashboard;
