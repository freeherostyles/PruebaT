import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierStatsResponseDto } from '../../dto/supplier-stats-response.dto';
import { GetSupplierStatsQuery } from '../get-supplier-stats.query';

@Injectable()
@QueryHandler(GetSupplierStatsQuery)
export class GetSupplierStatsQueryHandler implements IQueryHandler<GetSupplierStatsQuery> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async execute(
    _query: GetSupplierStatsQuery,
  ): Promise<SupplierStatsResponseDto> {
    void _query;
    const qb = this.supplierRepo
      .createQueryBuilder('s')
      .where('s.deleted_at IS NULL');

    const total = await qb.getCount();

    const active = await qb
      .clone()
      .andWhere('s.status = :status', { status: 'ACTIVE' })
      .getCount();
    const inactive = total - active;

    const personaFisica = await qb
      .clone()
      .andWhere('s.supplier_type = :type', { type: 'PERSONA_FISICA' })
      .getCount();
    const personaMoral = total - personaFisica;

    return { total, active, inactive, personaFisica, personaMoral };
  }
}
