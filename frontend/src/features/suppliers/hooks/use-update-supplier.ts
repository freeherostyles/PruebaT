import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { updateSupplierApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';
import type { UpdateSupplierPayload } from '../types/supplier';

export function useUpdateSupplier(id: string) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpdateSupplierPayload) =>
      updateSupplierApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
      enqueueSnackbar('Proveedor actualizado correctamente.', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar proveedor. Verifica los datos.', {
        variant: 'error',
      });
    },
  });
}
