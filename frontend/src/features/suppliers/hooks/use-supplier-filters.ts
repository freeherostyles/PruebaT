import { useMemo, useCallback } from 'react';
import { useSupplierFiltersStore } from '../store/supplier-filters.store';

export function useSupplierFilters() {
  const filters = useSupplierFiltersStore((s) => s.filters);
  const setFilter = useSupplierFiltersStore((s) => s.setFilter);
  const resetFilters = useSupplierFiltersStore((s) => s.resetFilters);
  const setPage = useSupplierFiltersStore((s) => s.setPage);
  const setLimit = useSupplierFiltersStore((s) => s.setLimit);

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || filters.type !== '' || filters.status !== '';
  }, [filters.search, filters.type, filters.status]);

  const handleSearch = useCallback(
    (value: string) => setFilter('search', value),
    [setFilter],
  );

  return {
    filters,
    hasActiveFilters,
    setFilter,
    resetFilters,
    setPage,
    setLimit,
    handleSearch,
  };
}
