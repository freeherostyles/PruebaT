import { UpdateSupplierDto } from '../dto/update-supplier.dto';

export class UpdateSupplierCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateSupplierDto,
  ) {}
}
