import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupplierStatsCards } from './SupplierStatsCards';

describe('SupplierStatsCards', () => {
  it('shows skeletons when loading', () => {
    const { container } = render(<SupplierStatsCards isLoading data={undefined} />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });

  it('renders stat values when data is provided', () => {
    const data = { total: 11, active: 7, inactive: 4, personaFisica: 6, personaMoral: 5 };
    render(<SupplierStatsCards data={data} isLoading={false} />);
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('returns null when no data and not loading', () => {
    const { container } = render(<SupplierStatsCards data={undefined} isLoading={false} />);
    expect(container.innerHTML).toBe('');
  });
});
