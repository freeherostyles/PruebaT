import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierResponseDto } from '../../dto/supplier-response.dto';
import { ChangeSupplierStatusCommand } from '../change-supplier-status.command';

@Injectable()
@CommandHandler(ChangeSupplierStatusCommand)
export class ChangeSupplierStatusCommandHandler implements ICommandHandler<ChangeSupplierStatusCommand> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async execute(
    command: ChangeSupplierStatusCommand,
  ): Promise<SupplierResponseDto> {
    const { id, status } = command;

    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    supplier.status = status;
    const saved = await this.supplierRepo.save(supplier);

    return SupplierResponseDto.fromEntity(saved);
  }
}
