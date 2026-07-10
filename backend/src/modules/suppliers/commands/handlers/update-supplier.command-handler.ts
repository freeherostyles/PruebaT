import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierResponseDto } from '../../dto/supplier-response.dto';
import { SupplierStrategyFactory } from '../../strategies/supplier-strategy-factory';
import { UpdateSupplierCommand } from '../update-supplier.command';

@Injectable()
@CommandHandler(UpdateSupplierCommand)
export class UpdateSupplierCommandHandler implements ICommandHandler<UpdateSupplierCommand> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    private readonly strategyFactory: SupplierStrategyFactory,
  ) {}

  async execute(command: UpdateSupplierCommand): Promise<SupplierResponseDto> {
    const { id, dto } = command;

    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const merged = { ...supplier };

    if (dto.firstName !== undefined) merged.firstName = dto.firstName;
    if (dto.lastName !== undefined) merged.lastName = dto.lastName;
    if (dto.secondLastName !== undefined)
      merged.secondLastName = dto.secondLastName;
    if (dto.businessName !== undefined) merged.businessName = dto.businessName;
    if (dto.tradeName !== undefined) merged.tradeName = dto.tradeName;
    if (dto.rfc !== undefined) {
      const newRfc = dto.rfc.toUpperCase();
      if (newRfc !== supplier.rfc) {
        const existing = await this.supplierRepo.findOne({
          where: { rfc: newRfc },
          withDeleted: true,
        });
        if (existing) {
          throw new ConflictException('RFC already exists');
        }
      }
      merged.rfc = newRfc;
    }
    if (dto.curp !== undefined) merged.curp = dto.curp ?? null;
    if (dto.contactPerson !== undefined)
      merged.contactPerson = dto.contactPerson ?? null;
    if (dto.email !== undefined) merged.email = dto.email ?? null;
    if (dto.phone !== undefined) merged.phone = dto.phone ?? null;

    const strategy = this.strategyFactory.getStrategy(supplier.supplierType);
    strategy.validate(merged);

    supplier.firstName = merged.firstName;
    supplier.lastName = merged.lastName;
    supplier.secondLastName = merged.secondLastName;
    supplier.businessName = merged.businessName;
    supplier.tradeName = merged.tradeName;
    supplier.rfc = merged.rfc;
    supplier.curp = merged.curp;
    supplier.contactPerson = merged.contactPerson;
    supplier.email = merged.email;
    supplier.phone = merged.phone;

    const saved = await this.supplierRepo.save(supplier);

    const withUser = await this.supplierRepo.findOne({
      where: { id: saved.id },
      relations: ['createdBy'],
    });

    return SupplierResponseDto.fromEntity(withUser!);
  }
}
