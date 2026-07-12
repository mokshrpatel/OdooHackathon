import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ placeholder = 'Search...', value, onChange }) => {
  return (
    <div className={styles.searchForm}>
      <span className={styles.icon}>🔍</span>
      <input 
        type="text" 
        className={styles.input} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
