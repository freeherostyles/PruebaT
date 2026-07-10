import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthBootstrap } from '../auth-bootstrap';
import { MainLayout } from '../layout/main-layout';
import { PublicRoute } from './guards';
import { PrivateRoute } from './guards';
import { LoginPage } from '../../features/auth/pages/login-page';
import { DashboardPage } from '../../features/dashboard/pages/dashboard-page';
import { SuppliersPage } from '../../features/suppliers/pages/suppliers-page';

export function AppRouter() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthBootstrap>
  );
}
