import { Route, Routes } from 'react-router-dom';
import { InfrastructureStatusPage } from '../../features/dashboard/pages/infrastructure-status-page';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<InfrastructureStatusPage />} />
    </Routes>
  );
}
