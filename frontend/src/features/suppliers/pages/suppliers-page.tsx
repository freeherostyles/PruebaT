import { Container, Stack, Typography } from '@mui/material';
import { useSupplierStats } from '../hooks/use-supplier-stats';
import { useSupplierList } from '../hooks/use-supplier-list';
import { useSupplierFilters } from '../hooks/use-supplier-filters';
import { useSupplierFiltersStore } from '../store/supplier-filters.store';
import { SupplierStatsCards } from '../components/SupplierStatsCards';
import { SupplierToolbar } from '../components/SupplierToolbar';
import { SupplierGrid } from '../components/SupplierGrid';
import { SupplierDetailDialog } from '../dialogs/supplier-detail-dialog';
import { ErrorState } from '../components/ErrorState';

export function SuppliersPage() {
  const { filters, hasActiveFilters, setFilter, resetFilters, handleSearch } =
    useSupplierFilters();

  const detailOpen = useSupplierFiltersStore((s) => s.detailOpen);
  const selectedId = useSupplierFiltersStore((s) => s.selectedId);
  const openDetail = useSupplierFiltersStore((s) => s.openDetail);
  const closeDetail = useSupplierFiltersStore((s) => s.closeDetail);

  const statsQuery = useSupplierStats();
  const listQuery = useSupplierList(filters);

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Proveedores
        </Typography>

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
          />
        )}
      </Stack>

      <SupplierDetailDialog
        supplierId={selectedId}
        open={detailOpen}
        onClose={closeDetail}
      />
    </Container>
  );
}
