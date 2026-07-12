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
                      width: `${Math.max(widthPct, 15)}%`, 
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
