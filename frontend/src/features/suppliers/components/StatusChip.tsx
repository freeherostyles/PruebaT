import type { SupplierStatus } from '../types/supplier';
import { StatusChip as SharedStatusChip } from '../../../shared/components/StatusChip';

interface StatusChipProps {
  status: SupplierStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  return <SharedStatusChip status={status} />;
}
