import { Chip } from '@mui/material';

type Status = 'ACTIVE' | 'INACTIVE';

const STATUS_CONFIG: Record<Status, { label: string; color: 'success' | 'error' }> = {
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'error' },
};

interface StatusChipProps {
  status: Status;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Chip label={config.label} color={config.color} size="small" variant="outlined" />
  );
}
