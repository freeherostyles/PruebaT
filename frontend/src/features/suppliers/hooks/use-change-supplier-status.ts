import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { changeSupplierStatusApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';
import type { SupplierStatus } from '../types/supplier';

export function useChangeSupplierStatus(id: string) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (status: SupplierStatus) => changeSupplierStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      enqueueSnackbar('Estado actualizado correctamente.', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Error al cambiar el estado.', { variant: 'error' });
    },
  });
}
