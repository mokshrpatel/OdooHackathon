const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// ROUTES
// ==========================================

writeFile('routes/RoutePaths.js', `
export const RoutePaths = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  DRIVERS: '/drivers',
  TRIPS: '/trips',
  MAINTENANCE: '/maintenance',
  EXPENSES: '/expenses',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};
`);

writeFile('routes/ProtectedRoute.jsx', `
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { RoutePaths } from './RoutePaths';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={RoutePaths.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={RoutePaths.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
`);

writeFile('routes/AppRouter.jsx', `
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Authentication from '../pages/Authentication';
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Drivers from '../pages/Drivers';
import Trips from '../pages/Trips';
import Maintenance from '../pages/Maintenance';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path={RoutePaths.LOGIN} element={<Authentication />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to={RoutePaths.DASHBOARD} replace />} />
            <Route path={RoutePaths.DASHBOARD} element={<Dashboard />} />
            <Route path={RoutePaths.VEHICLES} element={<Vehicles />} />
            <Route path={RoutePaths.DRIVERS} element={<Drivers />} />
            <Route path={RoutePaths.TRIPS} element={<Trips />} />
            <Route path={RoutePaths.MAINTENANCE} element={<Maintenance />} />
            <Route path={RoutePaths.EXPENSES} element={<Expenses />} />
            <Route path={RoutePaths.REPORTS} element={<Reports />} />
            <Route path={RoutePaths.SETTINGS} element={<Settings />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path={RoutePaths.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={RoutePaths.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
`);

// ==========================================
// SERVICES
// ==========================================

writeFile('services/axiosInstance.js', `
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if backend runs on a different port
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access globally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
`);

writeFile('services/auth/authService.js', `
import axiosInstance from '../axiosInstance';

export const loginUser = async (credentials) => {
  return await axiosInstance.post('/auth/login', credentials);
};
`);

writeFile('services/dashboard/dashboardService.js', `
import axiosInstance from '../axiosInstance';

export const getKPIs = async () => {
  return await axiosInstance.get('/dashboard/kpis');
};
`);

writeFile('services/vehicles/vehicleService.js', `
import axiosInstance from '../axiosInstance';

export const getVehicles = async () => {
  return await axiosInstance.get('/vehicles');
};

export const getAvailableVehicles = async () => {
  return await axiosInstance.get('/vehicles/available');
};

export const createVehicle = async (vehicleData) => {
  return await axiosInstance.post('/vehicles', vehicleData);
};
`);

writeFile('services/drivers/driverService.js', `
import axiosInstance from '../axiosInstance';

export const getDrivers = async () => {
  return await axiosInstance.get('/drivers');
};

export const getAvailableDrivers = async () => {
  return await axiosInstance.get('/drivers/available');
};

export const createDriver = async (driverData) => {
  return await axiosInstance.post('/drivers', driverData);
};
`);

writeFile('services/trips/tripService.js', `
import axiosInstance from '../axiosInstance';

export const createTrip = async (tripData) => {
  return await axiosInstance.post('/trips', tripData);
};

export const dispatchTrip = async (tripId) => {
  return await axiosInstance.patch(\`/trips/\${tripId}/dispatch\`);
};

export const completeTrip = async (tripId, data) => {
  return await axiosInstance.patch(\`/trips/\${tripId}/complete\`, data);
};

export const cancelTrip = async (tripId) => {
  return await axiosInstance.patch(\`/trips/\${tripId}/cancel\`);
};
`);

writeFile('services/maintenance/maintenanceService.js', `
import axiosInstance from '../axiosInstance';

export const createMaintenanceRecord = async (data) => {
  return await axiosInstance.post('/maintenance', data);
};

export const closeMaintenanceRecord = async (maintenanceId) => {
  return await axiosInstance.patch(\`/maintenance/\${maintenanceId}/close\`);
};
`);

writeFile('services/expenses/fuelService.js', `
import axiosInstance from '../axiosInstance';

export const recordFuelLog = async (data) => {
  return await axiosInstance.post('/expenses/fuel', data);
};
`);

writeFile('services/expenses/expenseService.js', `
import axiosInstance from '../axiosInstance';

export const recordGeneralExpense = async (data) => {
  return await axiosInstance.post('/expenses/general', data);
};
`);

writeFile('services/reports/reportService.js', `
import axiosInstance from '../axiosInstance';

export const getROI = async () => {
  return await axiosInstance.get('/reports/roi');
};
`);

writeFile('services/settings/settingsService.js', `
import axiosInstance from '../axiosInstance';

export const createUser = async (userData) => {
  return await axiosInstance.post('/users', userData);
};
`);

// ==========================================
// APP ROOT INTEGRATION
// ==========================================

writeFile('App.jsx', `
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
`);

console.log("Routes and services generated successfully.");
