import { Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SearchBar } from './SearchBar';
import type { SupplierType, SupplierStatus } from '../types/supplier';

interface SupplierToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  type: SupplierType | '';
  status: SupplierStatus | '';
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onTypeChange: (value: SupplierType | '') => void;
  onStatusChange: (value: SupplierStatus | '') => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: 'ASC' | 'DESC') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function SupplierToolbar({
  search,
  onSearch,
  type,
  status,
  sortBy,
  sortOrder,
  onTypeChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
  hasActiveFilters,
}: SupplierToolbarProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ alignItems: { md: 'flex-end' } }}
    >
      <SearchBar value={search} onChange={onSearch} />

      <FormControl size="small" sx={{ minWidth: 150, width: { xs: '100%', md: 'auto' } }}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select
          labelId="type-label"
          label="Tipo"
          value={type}
          onChange={(e) => onTypeChange(e.target.value as SupplierType | '')}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="PERSONA_FISICA">Persona Física</MenuItem>
          <MenuItem value="PERSONA_MORAL">Persona Moral</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140, width: { xs: '100%', md: 'auto' } }}>
        <InputLabel id="status-label">Estado</InputLabel>
        <Select
          labelId="status-label"
          label="Estado"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as SupplierStatus | '')}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ACTIVE">Activo</MenuItem>
          <MenuItem value="INACTIVE">Inactivo</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130, width: { xs: '100%', md: 'auto' } }}>
        <InputLabel id="sortby-label">Orden</InputLabel>
        <Select
          labelId="sortby-label"
          label="Orden"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <MenuItem value="createdAt">Fecha</MenuItem>
          <MenuItem value="rfc">RFC</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100, width: { xs: '100%', md: 'auto' } }}>
        <Select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as 'ASC' | 'DESC')}
        >
          <MenuItem value="DESC">DESC</MenuItem>
          <MenuItem value="ASC">ASC</MenuItem>
        </Select>
      </FormControl>

      {hasActiveFilters && (
        <Button
          variant="text"
          size="small"
          startIcon={<FilterListIcon />}
          onClick={onReset}
          sx={{ textTransform: 'none', alignSelf: { xs: 'stretch', md: 'auto' } }}
        >
          Limpiar
        </Button>
      )}
    </Stack>
  );
}
