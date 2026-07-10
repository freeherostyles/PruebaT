import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from './dashboard-page';
import { useAuthStore } from '../../auth/store/auth.store';
import { getSupplierStatsApi } from '../../suppliers/api/supplier.api';
import type { Mock } from 'vitest';

vi.mock('../../suppliers/api/supplier.api');

const mockGetStats = getSupplierStatsApi as Mock;

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <DashboardPage />
    </QueryClientProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: 'x',
      user: { id: '1', fullName: 'Admin', email: 'a@a.com', role: 'ADMIN' },
      isAuthenticated: true,
      isRestoring: false,
    });
  });

  it('shows loading state initially', () => {
    mockGetStats.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows metrics when data loads', async () => {
    mockGetStats.mockResolvedValue({
      total: 10,
      active: 7,
      inactive: 3,
      personaFisica: 6,
      personaMoral: 4,
    });

    renderPage();

    expect(await screen.findByText('10')).toBeInTheDocument();
    expect(await screen.findByText('7')).toBeInTheDocument();
    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(await screen.findByText('6')).toBeInTheDocument();
    expect(await screen.findByText('4')).toBeInTheDocument();
  });

  it('shows error state on failure', async () => {
    mockGetStats.mockRejectedValue(new Error('Network Error'));

    renderPage();

    expect(await screen.findByText(/No se pudieron cargar/)).toBeInTheDocument();
  });
});
