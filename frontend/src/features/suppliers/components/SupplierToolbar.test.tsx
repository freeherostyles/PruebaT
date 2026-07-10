import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupplierToolbar } from './SupplierToolbar';

describe('SupplierToolbar', () => {
  const defaultProps = {
    search: '',
    onSearch: vi.fn(),
    type: '' as const,
    status: '' as const,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    onTypeChange: vi.fn(),
    onStatusChange: vi.fn(),
    onSortByChange: vi.fn(),
    onSortOrderChange: vi.fn(),
    onReset: vi.fn(),
    hasActiveFilters: false,
  };

  it('renders search and filter controls', () => {
    render(<SupplierToolbar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Buscar por RFC/)).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado')).toBeInTheDocument();
  });

  it('shows clear button when filters are active', () => {
    render(<SupplierToolbar {...defaultProps} hasActiveFilters />);
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });
});
