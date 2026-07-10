import { create } from 'zustand';
import type { SupplierFilters } from '../types/supplier';

interface SupplierFiltersState {
  filters: SupplierFilters;
  selectedId: string | null;
  detailOpen: boolean;
  setFilter: <K extends keyof SupplierFilters>(
    key: K,
    value: SupplierFilters[K],
  ) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
}

const DEFAULT_FILTERS: SupplierFilters = {
  search: '',
  type: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  page: 1,
  limit: 10,
};

export const useSupplierFiltersStore = create<SupplierFiltersState>(
  (set) => ({
    filters: { ...DEFAULT_FILTERS },
    selectedId: null,
    detailOpen: false,

    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value, page: key === 'page' ? (value as number) : 1 },
      })),

    resetFilters: () =>
      set({ filters: { ...DEFAULT_FILTERS } }),

    setPage: (page) =>
      set((state) => ({
        filters: { ...state.filters, page },
      })),

    setLimit: (limit) =>
      set((state) => ({
        filters: { ...state.filters, limit, page: 1 },
      })),

    openDetail: (id) =>
      set({ selectedId: id, detailOpen: true }),

    closeDetail: () =>
      set({ selectedId: null, detailOpen: false }),
  }),
);
