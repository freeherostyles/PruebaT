import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { SupplierGrid } from './SupplierGrid';
import { useAuthStore } from '../../auth/store/auth.store';
import type { Supplier } from '../types/supplier';

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    supplierType: 'PERSONA_FISICA',
    status: 'ACTIVE',
    firstName: 'Juan',
    lastName: 'Pérez',
    secondLastName: null,
    businessName: null,
    tradeName: null,
    rfc: 'JUAN800101ABC',
    curp: null,
    contactPerson: null,
    email: null,
    phone: null,
    createdById: 'u1',
    createdBy: { id: 'u1', fullName: 'Admin', email: 'admin@test.com' },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={createTheme()}>
      <div style={{ width: 800, height: 400 }}>{ui}</div>
    </ThemeProvider>,
  );
}

describe('SupplierGrid', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: 'x',
      user: { id: 'u1', fullName: 'Admin', email: 'a@a.com', role: 'ADMIN' },
      isAuthenticated: true,
      isRestoring: false,
    });
  });

  const defaultProps = {
    data: mockSuppliers,
    total: 1,
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    isLoading: false,
    onPageChange: vi.fn(),
    onLimitChange: vi.fn(),
    onSortChange: vi.fn(),
    onRowClick: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleStatus: vi.fn(),
  };

  it('renders supplier data', () => {
    renderWithTheme(<SupplierGrid {...defaultProps} />);
    expect(screen.getByText('JUAN800101ABC')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    renderWithTheme(<SupplierGrid {...defaultProps} data={[]} total={0} />);
    expect(screen.getByText('No se encontraron proveedores')).toBeInTheDocument();
  });
});
