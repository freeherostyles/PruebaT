import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { User } from '../../../users/user.entity';
import { SupplierStatus } from '../../supplier-status.enum';
import { SupplierResponseDto } from '../../dto/supplier-response.dto';
import { SupplierStrategyFactory } from '../../strategies/supplier-strategy-factory';
import { CreateSupplierCommand } from '../create-supplier.command';

@Injectable()
@CommandHandler(CreateSupplierCommand)
export class CreateSupplierCommandHandler implements ICommandHandler<CreateSupplierCommand> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly strategyFactory: SupplierStrategyFactory,
  ) {}

  async execute(command: CreateSupplierCommand): Promise<SupplierResponseDto> {
    const { userId, dto } = command;
    const rfc = dto.rfc.toUpperCase();

    const existing = await this.supplierRepo.findOne({
      where: { rfc },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('RFC already exists');
    }

    const strategy = this.strategyFactory.getStrategy(dto.supplierType);
    strategy.validate({ ...dto, rfc });

    const userRef = await this.userRepo.findOneBy({ id: userId });
    if (!userRef) {
      throw new NotFoundException('User not found');
    }

    const supplier = this.supplierRepo.create({
      supplierType: dto.supplierType,
      status: dto.status ?? SupplierStatus.ACTIVE,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
      secondLastName: dto.secondLastName ?? null,
      businessName: dto.businessName ?? null,
      tradeName: dto.tradeName ?? null,
      rfc,
      curp: dto.curp ?? null,
      contactPerson: dto.contactPerson ?? null,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      createdBy: userRef,
    });

    const saved = await this.supplierRepo.save(supplier);

    const withUser = await this.supplierRepo.findOne({
      where: { id: saved.id },
      relations: ['createdBy'],
    });

    return SupplierResponseDto.fromEntity(withUser!);
  }
}
