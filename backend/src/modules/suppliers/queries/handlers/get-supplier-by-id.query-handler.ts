import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierResponseDto } from '../../dto/supplier-response.dto';
import { GetSupplierByIdQuery } from '../get-supplier-by-id.query';

@Injectable()
@QueryHandler(GetSupplierByIdQuery)
export class GetSupplierByIdQueryHandler implements IQueryHandler<GetSupplierByIdQuery> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async execute(query: GetSupplierByIdQuery): Promise<SupplierResponseDto> {
    const supplier = await this.supplierRepo.findOne({
      where: { id: query.id },
      relations: ['createdBy'],
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return SupplierResponseDto.fromEntity(supplier);
  }
}
