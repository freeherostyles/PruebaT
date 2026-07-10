import { useCallback, useMemo } from 'react';
import { DataGrid, type GridRowParams, type GridSortModel } from '@mui/x-data-grid';
import type { Supplier } from '../types/supplier';
import { createSupplierColumns } from '../config/supplier-columns';
import { useAuthStore } from '../../auth/store/auth.store';

interface SupplierGridProps {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  onRowClick: (id: string) => void;
}

export function SupplierGrid({
  data,
  total,
  page,
  limit,
  sortBy,
  sortOrder,
  isLoading,
  onPageChange,
  onLimitChange,
  onSortChange,
  onRowClick,
}: SupplierGridProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const columns = useMemo(() => createSupplierColumns(isAdmin), [isAdmin]);

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (model.length > 0) {
        onSortChange(model[0].field, model[0].sort === 'asc' ? 'ASC' : 'DESC');
      }
    },
    [onSortChange],
  );

  const handleRowClick = useCallback(
    (params: GridRowParams<Supplier>) => {
      onRowClick(params.row.id);
    },
    [onRowClick],
  );

  const sortModel = useMemo(
    () => [{ field: sortBy, sort: sortOrder.toLowerCase() as 'asc' | 'desc' }],
    [sortBy, sortOrder],
  );

  return (
    <DataGrid
      rows={data}
      columns={columns}
      rowCount={total}
      loading={isLoading}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationModel={{ page: page - 1, pageSize: limit }}
      onPaginationModelChange={(model) => {
        onLimitChange(model.pageSize);
        onPageChange(model.page + 1);
      }}
      paginationMode="server"
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      onRowClick={handleRowClick}
      disableColumnMenu
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      localeText={{
        noRowsLabel: 'No se encontraron proveedores',
        footerRowSelected: () => '',
      }}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        '& .MuiDataGrid-cell:focus': { outline: 'none' },
        '& .MuiDataGrid-row': { cursor: 'pointer' },
        '& .MuiDataGrid-footerContainer': { borderTop: '1px solid', borderColor: 'divider' },
      }}
    />
  );
}
