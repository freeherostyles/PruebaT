import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { DeleteSupplierCommand } from '../delete-supplier.command';

@Injectable()
@CommandHandler(DeleteSupplierCommand)
export class DeleteSupplierCommandHandler implements ICommandHandler<DeleteSupplierCommand> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async execute(command: DeleteSupplierCommand): Promise<void> {
    const { id } = command;

    const supplier = await this.supplierRepo.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.supplierRepo.softRemove(supplier);
  }
}
