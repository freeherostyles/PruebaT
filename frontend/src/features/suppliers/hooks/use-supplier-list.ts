import { useQuery } from '@tanstack/react-query';
import { getSuppliersApi } from '../api/supplier.api';
import { supplierKeys } from '../utils/supplier-query-keys';
import type { SupplierFilters } from '../types/supplier';

export function useSupplierList(filters: SupplierFilters) {
  const queryParams = {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    type: filters.type || undefined,
    status: filters.status || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  return useQuery({
    queryKey: supplierKeys.list(queryParams),
    queryFn: () => getSuppliersApi(queryParams),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
    gcTime: 60_000,
  });
}
