import { Chip } from '@mui/material';
import type { SupplierType } from '../types/supplier';

const TYPE_CONFIG: Record<SupplierType, { label: string; color: 'warning' | 'secondary' }> = {
  PERSONA_FISICA: { label: 'Persona Física', color: 'warning' },
  PERSONA_MORAL: { label: 'Persona Moral', color: 'secondary' },
};

interface SupplierTypeChipProps {
  type: SupplierType;
}

export function SupplierTypeChip({ type }: SupplierTypeChipProps) {
  const config = TYPE_CONFIG[type];
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
}
