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
            style={{ width: `${progress}%`, backgroundColor: progressColor }}
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
        value={`${kpis.fleetUtilizationPercentage || 0}%`} 
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
