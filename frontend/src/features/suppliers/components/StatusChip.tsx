import { Chip } from '@mui/material';
import type { SupplierStatus } from '../types/supplier';

const STATUS_CONFIG: Record<SupplierStatus, { label: string; color: 'success' | 'error' }> = {
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'error' },
};

interface StatusChipProps {
  status: SupplierStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
}
