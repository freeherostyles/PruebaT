import { useQuery } from '@tanstack/react-query';
import { getSupplierStatsApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';

export function useSupplierStats() {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: getSupplierStatsApi,
    staleTime: 60_000,
    gcTime: 120_000,
  });
}
