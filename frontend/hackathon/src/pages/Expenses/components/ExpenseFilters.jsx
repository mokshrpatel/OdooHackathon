import React from 'react';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/ui/Select';
import styles from '../Expenses.module.css';

const ExpenseFilters = ({ searchQuery, onSearchChange, typeFilter, onTypeChange }) => {
  return (
    <div className={styles.filters}>
      <SearchBar 
        placeholder="Search by Vehicle ID or Trip ID..." 
        value={searchQuery} 
        onChange={onSearchChange} 
      />
      <div style={{ width: '200px' }}>
        <Select 
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          options={[
            { label: 'All Expenses', value: 'All' },
            { label: 'Fuel', value: 'Fuel' },
            { label: 'Toll', value: 'Toll' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Other', value: 'Other' }
          ]}
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;
