import { SupplierStatus } from '../supplier-status.enum';

export class ChangeSupplierStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: SupplierStatus,
  ) {}
}
