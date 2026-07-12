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
