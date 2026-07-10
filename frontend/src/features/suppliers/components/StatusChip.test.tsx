import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('renders active status', () => {
    render(<StatusChip status="ACTIVE" />);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders inactive status', () => {
    render(<StatusChip status="INACTIVE" />);
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });
});
