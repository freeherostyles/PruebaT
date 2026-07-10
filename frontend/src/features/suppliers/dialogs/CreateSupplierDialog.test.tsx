import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { CreateSupplierDialog } from './CreateSupplierDialog';

function renderDialog() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider theme={createTheme()}>
      <SnackbarProvider>
        <QueryClientProvider client={qc}>
          <CreateSupplierDialog open onClose={vi.fn()} />
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>,
  );
}

describe('CreateSupplierDialog', () => {
  it('renders form fields', () => {
    renderDialog();
    expect(screen.getByText('Nuevo proveedor')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de proveedor')).toBeInTheDocument();
    expect(screen.getByLabelText('RFC')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('shows physical fields by default', () => {
    renderDialog();
    expect(screen.getByLabelText('Nombre(s)')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido paterno')).toBeInTheDocument();
  });

  it('shows company fields when type changes', () => {
    renderDialog();
    fireEvent.mouseDown(screen.getByLabelText('Tipo de proveedor'));
    const moralOption = screen.getByText('Persona Moral');
    fireEvent.click(moralOption);
    expect(screen.getByLabelText('Razón social')).toBeInTheDocument();
  });
});
