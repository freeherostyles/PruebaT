import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { deleteSupplierApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: deleteSupplierApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
      enqueueSnackbar('Proveedor eliminado correctamente.', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar proveedor.', { variant: 'error' });
    },
  });
}
