import React, { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className={`${styles.selectWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <select ref={ref} className={styles.select} {...props}>
        <option value="" disabled>Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
