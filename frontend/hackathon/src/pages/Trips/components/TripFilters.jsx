import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Trips.module.css';

const TripFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Destination..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Dispatched', value: 'Dispatched' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]}
        />
      </div>
    </div>
  );
};

export default TripFilters;
