import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Drivers.module.css';

const DriverFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Name or License..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Available', value: 'Available' },
            { label: 'On Trip', value: 'On Trip' },
            { label: 'Off Duty', value: 'Off Duty' },
            { label: 'Suspended', value: 'Suspended' }
          ]}
        />
      </div>
    </div>
  );
};

export default DriverFilters;
