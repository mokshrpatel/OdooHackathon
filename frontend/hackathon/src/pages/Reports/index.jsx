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
