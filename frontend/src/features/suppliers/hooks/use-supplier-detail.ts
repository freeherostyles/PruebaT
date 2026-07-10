import { useQuery } from '@tanstack/react-query';
import { getSupplierByIdApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';

export function useSupplierDetail(id: string | null) {
  return useQuery({
    queryKey: supplierKeys.detail(id ?? ''),
    queryFn: () => getSupplierByIdApi(id!),
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 120_000,
  });
}
