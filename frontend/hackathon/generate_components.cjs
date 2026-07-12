const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

// Utility to create directory and write file
function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// 1. STYLES
writeFile('assets/styles/variables.css', `
:root {
  /* Dark Premium Theme - Zinc/Slate Palette */
  --bg-main: #09090b;
  --bg-surface: #18181b;
  --bg-surface-hover: #27272a;
  
  --text-main: #fafafa;
  --text-muted: #a1a1aa;
  
  --border-color: #27272a;
  --border-focus: #3b82f6;
  
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-glow: rgba(59, 130, 246, 0.2);
  
  --danger: #ef4444;
  --danger-hover: #dc2626;
  
  --success: #22c55e;
  --warning: #f59e0b;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 20px var(--primary-glow);
  
  --transition: 0.2s ease;
  
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
`);

writeFile('assets/styles/global.css', `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import './variables.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-main);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

a {
  color: inherit;
  text-decoration: none;
}
`);

// 2. UI COMPONENTS

// Button
writeFile('components/ui/Button/Button.module.css', `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid transparent;
  outline: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background-color: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  box-shadow: var(--shadow-glow);
}

.secondary {
  background-color: var(--bg-surface);
  color: var(--text-main);
  border-color: var(--border-color);
}

.secondary:hover:not(:disabled) {
  background-color: var(--bg-surface-hover);
  border-color: var(--border-focus);
}

.danger {
  background-color: transparent;
  color: var(--danger);
  border-color: var(--danger);
}

.danger:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
}

.ghost {
  background-color: transparent;
  color: var(--text-muted);
}

.ghost:hover:not(:disabled) {
  background-color: var(--bg-surface);
  color: var(--text-main);
}
`);

writeFile('components/ui/Button/index.jsx', `
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', icon, ...props }) => {
  return (
    <button 
      type={type}
      className={\`\${styles.btn} \${styles[variant]} \${className}\`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
`);

// Input
writeFile('components/ui/Input/Input.module.css', `
.inputWrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.label {
  font-size: 0.875rem;
  color: var(--text-main);
  font-weight: 500;
}

.inputContainer {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 10px 14px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.875rem;
  transition: all var(--transition);
  outline: none;
}

.input.hasIcon {
  padding-left: 38px;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}

.input.error {
  border-color: var(--danger);
}

.input.error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.errorText {
  color: var(--danger);
  font-size: 0.75rem;
  margin-top: 2px;
}
`);

writeFile('components/ui/Input/index.jsx', `
import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className={\`\${styles.inputWrapper} \${className}\`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input 
          ref={ref}
          className={\`\${styles.input} \${icon ? styles.hasIcon : ''} \${error ? styles.error : ''}\`} 
          {...props} 
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
`);

// Card
writeFile('components/ui/Card/Card.module.css', `
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
}

.body {
  padding: 20px;
}

.footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
`);

writeFile('components/ui/Card/index.jsx', `
import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, className = '' }) => (
  <div className={\`\${styles.card} \${className}\`}>{children}</div>
);

export const CardHeader = ({ title, action, className = '' }) => (
  <div className={\`\${styles.header} \${className}\`}>
    {title && <h3 className={styles.title}>{title}</h3>}
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={\`\${styles.body} \${className}\`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={\`\${styles.footer} \${className}\`}>{children}</div>
);

export default Card;
`);

// Table
writeFile('components/ui/Table/Table.module.css', `
.tableContainer {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}

.th {
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.02);
  color: var(--text-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

.td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  vertical-align: middle;
}

.tr {
  transition: background-color var(--transition);
}

.tr:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.tr:last-child .td {
  border-bottom: none;
}
`);

writeFile('components/ui/Table/index.jsx', `
import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data, keyField = 'id', onRowClick }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.td} style={{ textAlign: 'center', padding: '24px' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={row[keyField]} 
                className={styles.tr}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, i) => (
                  <td key={i} className={styles.td}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
`);

// Badge
writeFile('components/ui/Badge/Badge.module.css', `
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.success {
  background-color: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.warning {
  background-color: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.danger {
  background-color: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.info {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.neutral {
  background-color: rgba(161, 161, 170, 0.15);
  color: #a1a1aa;
}
`);

writeFile('components/ui/Badge/index.jsx', `
import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={\`\${styles.badge} \${styles[variant]} \${className}\`}>
      {children}
    </span>
  );
};

export default Badge;
`);

// Select
writeFile('components/ui/Select/Select.module.css', `
.selectWrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.label {
  font-size: 0.875rem;
  color: var(--text-main);
  font-weight: 500;
}

.select {
  width: 100%;
  padding: 10px 14px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 10px auto;
  transition: all var(--transition);
}

.select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}

.errorText {
  color: var(--danger);
  font-size: 0.75rem;
}
`);

writeFile('components/ui/Select/index.jsx', `
import React, { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className={\`\${styles.selectWrapper} \${className}\`}>
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
`);

// Modal
writeFile('components/ui/Modal/Modal.module.css', `
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

.modal {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.closeBtn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.closeBtn:hover {
  color: var(--text-main);
}

.body {
  padding: 20px;
  overflow-y: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`);

writeFile('components/ui/Modal/index.jsx', `
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
`);

// Loader
writeFile('components/ui/Loader/Loader.module.css', `
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

.loaderContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
}

.text {
  color: var(--text-muted);
  font-size: 0.875rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`);

writeFile('components/ui/Loader/index.jsx', `
import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ fullPage = false, text = 'Loading...' }) => {
  const containerStyle = fullPage ? { height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, background: 'var(--bg-main)', zIndex: 9999 } : {};
  
  return (
    <div className={styles.loaderContainer} style={containerStyle}>
      <div className={styles.spinner}></div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default Loader;
`);

// Common Components

// PageHeader
writeFile('components/common/PageHeader/PageHeader.module.css', `
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
}
`);

writeFile('components/common/PageHeader/index.jsx', `
import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, action }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
};

export default PageHeader;
`);

// SearchBar
writeFile('components/common/SearchBar/SearchBar.module.css', `
.searchForm {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.input {
  width: 100%;
  padding: 8px 16px 8px 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--text-main);
  font-size: 0.875rem;
  outline: none;
  transition: all var(--transition);
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}

.icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
`);

writeFile('components/common/SearchBar/index.jsx', `
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
`);

// EmptyState
writeFile('components/common/EmptyState/EmptyState.module.css', `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-lg);
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.description {
  color: var(--text-muted);
  margin-bottom: 24px;
  max-width: 400px;
}
`);

writeFile('components/common/EmptyState/index.jsx', `
import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon = '📁', title = 'No Data Found', description = 'There are currently no records to display.', action }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
`);

// ConfirmationDialog
writeFile('components/common/ConfirmationDialog/index.jsx', `
import React from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
`);

// Pagination (Simplified mock for UI)
writeFile('components/common/Pagination/index.jsx', `
import React from 'react';
import Button from '../../ui/Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Page {currentPage} of {totalPages}
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
          variant="secondary" 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button 
          variant="secondary" 
          disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
`);

console.log("Components generated successfully.");
