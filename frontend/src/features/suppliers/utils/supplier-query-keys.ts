const SUPPLIERS_KEY = 'suppliers';

export const supplierKeys = {
  all: [SUPPLIERS_KEY] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...supplierKeys.lists(), filters] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  stats: () => [...supplierKeys.all, 'stats'] as const,
};
