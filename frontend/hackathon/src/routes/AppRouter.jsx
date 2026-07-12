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
