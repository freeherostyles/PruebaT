import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { createSupplierApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: createSupplierApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      enqueueSnackbar('Proveedor creado correctamente.', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al crear proveedor. Verifica los datos.', {
        variant: 'error',
      });
    },
  });
}
