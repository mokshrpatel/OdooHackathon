const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// UTILS
// ==========================================

writeFile('utils/constants.js', `
export const ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};

export const DRIVER_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
};

export const TRIP_STATUS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
`);

writeFile('utils/apiEndpoints.js', `
export const API_ENDPOINTS = {
  AUTH: '/auth/login',
  USERS: '/users',
  DASHBOARD_KPIS: '/dashboard/kpis',
  REPORTS_ROI: '/reports/roi',
  VEHICLES: '/vehicles',
  VEHICLES_AVAILABLE: '/vehicles/available',
  DRIVERS: '/drivers',
  DRIVERS_AVAILABLE: '/drivers/available',
  TRIPS: '/trips',
  MAINTENANCE: '/maintenance',
  EXPENSES_FUEL: '/expenses/fuel',
  EXPENSES_GENERAL: '/expenses/general',
};
`);

writeFile('utils/dateFormatter.js', `
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatInputDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};
`);

writeFile('utils/currencyFormatter.js', `
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
`);

writeFile('utils/statusColors.js', `
export const getStatusVariant = (status) => {
  switch (status) {
    // Success / Positive
    case 'Available':
    case 'Completed':
    case 'Active':
      return 'success';
    
    // Warning / In-Progress
    case 'On Trip':
    case 'Dispatched':
    case 'In Shop':
    case 'Draft':
      return 'warning';
    
    // Danger / Negative
    case 'Retired':
    case 'Suspended':
    case 'Off Duty':
    case 'Cancelled':
      return 'danger';
      
    default:
      return 'neutral';
  }
};
`);

writeFile('utils/rolePermissions.js', `
import { ROLES } from './constants';

// Define which roles are allowed to access specific modules
export const PERMISSIONS = {
  DASHBOARD: [ROLES.FLEET_MANAGER, ROLES.DISPATCHER],
  VEHICLES: [ROLES.FLEET_MANAGER, ROLES.DISPATCHER],
  VEHICLES_CREATE: [ROLES.FLEET_MANAGER],
  DRIVERS: [ROLES.SAFETY_OFFICER, ROLES.FLEET_MANAGER, ROLES.DISPATCHER],
  DRIVERS_CREATE: [ROLES.SAFETY_OFFICER],
  TRIPS: [ROLES.DISPATCHER, ROLES.FLEET_MANAGER],
  MAINTENANCE: [ROLES.FLEET_MANAGER],
  EXPENSES: [ROLES.DISPATCHER, ROLES.FLEET_MANAGER],
  REPORTS: [ROLES.FLEET_MANAGER],
  SETTINGS: [ROLES.FLEET_MANAGER],
};

export const hasPermission = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles) return false;
  return allowedRoles.includes(userRole);
};
`);

writeFile('utils/validation.js', `
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const isValidEmail = (email) => {
  const re = /^\\S+@\\S+\\.\\S+$/;
  return re.test(email);
};

export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

export const validateForm = (data, rules) => {
  const errors = {};
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = 'This field is required';
    } else if (fieldRules.isEmail && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (fieldRules.isPositive && !isPositiveNumber(value)) {
      errors[field] = 'Must be a positive number';
    }
  });
  return Object.keys(errors).length > 0 ? errors : null;
};
`);

writeFile('utils/calculateExpense.js', `
export const calculateTotalOperationalCost = (fuelCost, maintenanceCost, generalExpense = 0) => {
  return (Number(fuelCost) || 0) + (Number(maintenanceCost) || 0) + (Number(generalExpense) || 0);
};
`);

writeFile('utils/calculateFuelEfficiency.js', `
export const calculateFuelEfficiency = (distance, fuelLiters) => {
  if (!fuelLiters || fuelLiters === 0) return 0;
  return (Number(distance) / Number(fuelLiters)).toFixed(2);
};
`);

writeFile('utils/calculateROI.js', `
/**
 * Calculates operational costs and Vehicle ROI using the formula:
 * Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
 */
export const calculateROI = (revenue, operationalCost, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  const netProfit = Number(revenue) - Number(operationalCost);
  const roi = (netProfit / Number(acquisitionCost)) * 100;
  return roi.toFixed(2);
};
`);

writeFile('utils/tokenStorage.js', `
export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
`);

console.log("Utils generated successfully.");
