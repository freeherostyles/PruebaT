import { useQuery } from '@tanstack/react-query';
import { getSupplierStatsApi } from '../api/stats.api';

export function useSupplierStats() {
  return useQuery({
    queryKey: ['supplier-stats'],
    queryFn: getSupplierStatsApi,
  });
}
