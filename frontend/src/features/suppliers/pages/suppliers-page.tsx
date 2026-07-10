import { useState, useCallback } from 'react';
import { Container, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSupplierStats } from '../hooks/use-supplier-stats';
import { useSupplierList } from '../hooks/use-supplier-list';
import { useSupplierFilters } from '../hooks/use-supplier-filters';
import { useSupplierFiltersStore } from '../store/supplier-filters.store';
import { useDeleteSupplier } from '../hooks/use-delete-supplier';
import { useChangeSupplierStatus } from '../hooks/use-change-supplier-status';
import { useAuthStore } from '../../auth/store/auth.store';
import { SupplierStatsCards } from '../components/SupplierStatsCards';
import { SupplierToolbar } from '../components/SupplierToolbar';
import { SupplierGrid } from '../components/SupplierGrid';
import { SupplierDetailDialog } from '../dialogs/supplier-detail-dialog';
import { CreateSupplierDialog } from '../dialogs/CreateSupplierDialog';
import { EditSupplierDialog } from '../dialogs/EditSupplierDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { ErrorState } from '../components/ErrorState';
import type { SupplierStatus } from '../types/supplier';

export function SuppliersPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const { filters, hasActiveFilters, setFilter, resetFilters, handleSearch } =
    useSupplierFilters();

  const detailOpen = useSupplierFiltersStore((s) => s.detailOpen);
  const selectedId = useSupplierFiltersStore((s) => s.selectedId);
  const openDetail = useSupplierFiltersStore((s) => s.openDetail);
  const closeDetail = useSupplierFiltersStore((s) => s.closeDetail);

  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<{
    id: string;
    status: SupplierStatus;
  } | null>(null);

  const deleteMutation = useDeleteSupplier();
  const statusMutation = useChangeSupplierStatus(
    statusTarget?.id ?? '',
  );

  const statsQuery = useSupplierStats();
  const listQuery = useSupplierList(filters);

  const handleEdit = useCallback((id: string) => setEditId(id), []);
  const handleDeleteRequest = useCallback(
    (id: string) => setDeleteId(id),
    [],
  );
  const handleToggleStatus = useCallback(
    (id: string, status: SupplierStatus) => setStatusTarget({ id, status }),
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }, [deleteId, deleteMutation]);

  const handleConfirmStatus = useCallback(() => {
    if (!statusTarget) return;
    statusMutation.mutate(statusTarget.status, {
      onSuccess: () => setStatusTarget(null),
    });
  }, [statusTarget, statusMutation]);

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Proveedores
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              Nuevo proveedor
            </Button>
          )}
        </Stack>

        <SupplierStatsCards
          data={statsQuery.data}
          isLoading={statsQuery.isLoading}
        />

        <SupplierToolbar
          search={filters.search}
          onSearch={handleSearch}
          type={filters.type}
          status={filters.status}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onTypeChange={(val) => setFilter('type', val)}
          onStatusChange={(val) => setFilter('status', val)}
          onSortByChange={(val) => setFilter('sortBy', val)}
          onSortOrderChange={(val) => setFilter('sortOrder', val)}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {listQuery.isError ? (
          <ErrorState
            message="No se pudieron cargar los proveedores"
            onRetry={() => listQuery.refetch()}
          />
        ) : (
          <SupplierGrid
            data={listQuery.data?.data ?? []}
            total={listQuery.data?.meta.total ?? 0}
            page={filters.page}
            limit={filters.limit}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            isLoading={listQuery.isLoading || listQuery.isPlaceholderData}
            onPageChange={(p) => setFilter('page', p)}
            onLimitChange={(l) => setFilter('limit', l)}
            onSortChange={(sb, so) => {
              setFilter('sortBy', sb);
              setFilter('sortOrder', so);
            }}
            onRowClick={(id) => openDetail(id)}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Stack>

      <SupplierDetailDialog
        supplierId={selectedId}
        open={detailOpen}
        onClose={closeDetail}
      />

      <CreateSupplierDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditSupplierDialog
        supplierId={editId}
        open={editId !== null}
        onClose={() => setEditId(null)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar proveedor"
        description="Esta acción no se puede deshacer. ¿Estás seguro de eliminar este proveedor?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmDialog
        open={statusTarget !== null}
        title={
          statusTarget?.status === 'ACTIVE' ? 'Activar proveedor' : 'Desactivar proveedor'
        }
        description={
          statusTarget?.status === 'ACTIVE'
            ? '¿Estás seguro de activar este proveedor?'
            : '¿Estás seguro de desactivar este proveedor?'
        }
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Activar' : 'Desactivar'}
        cancelLabel="Cancelar"
        loading={statusMutation.isPending}
        onConfirm={handleConfirmStatus}
        onCancel={() => setStatusTarget(null)}
      />
    </Container>
  );
}
