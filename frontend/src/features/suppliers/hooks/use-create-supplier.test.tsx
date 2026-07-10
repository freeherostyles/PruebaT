import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useCreateSupplier } from './use-create-supplier';
import { createSupplierApi } from '../api/supplier.api';
import type { Mock } from 'vitest';

vi.mock('../api/supplier.api');

const mockCreate = createSupplierApi as Mock;

function renderUseCreateSupplier() {
  const qc = new QueryClient();
  return renderHook(() => useCreateSupplier(), {
    wrapper: ({ children }) => (
      <SnackbarProvider>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </SnackbarProvider>
    ),
  });
}

describe('useCreateSupplier', () => {
  it('calls createSupplierApi on mutation', async () => {
    mockCreate.mockResolvedValue({ id: '1' });
    const { result } = renderUseCreateSupplier();
    result.current.mutate({
      supplierType: 'PERSONA_FISICA',
      firstName: 'Test',
      lastName: 'User',
      rfc: 'TEST990101ABC',
    });
    await waitFor(() => expect(mockCreate).toHaveBeenCalledOnce());
  });
});
