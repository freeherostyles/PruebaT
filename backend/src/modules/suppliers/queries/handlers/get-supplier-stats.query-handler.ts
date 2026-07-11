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
    const row = await this.supplierRepo
      .createQueryBuilder('s')
      .select('COUNT(s.id)', 'total')
      .addSelect(
        `SUM(CASE WHEN s.status = 'ACTIVE' THEN 1 ELSE 0 END)`,
        'active',
      )
      .addSelect(
        `SUM(CASE WHEN s.status = 'INACTIVE' THEN 1 ELSE 0 END)`,
        'inactive',
      )
      .addSelect(
        `SUM(CASE WHEN s.supplier_type = 'PERSONA_FISICA' THEN 1 ELSE 0 END)`,
        'personaFisica',
      )
      .addSelect(
        `SUM(CASE WHEN s.supplier_type = 'PERSONA_MORAL' THEN 1 ELSE 0 END)`,
        'personaMoral',
      )
      .where('s.deleted_at IS NULL')
      .getRawOne<Record<string, string>>();

    return {
      total: Number(row?.total ?? 0),
      active: Number(row?.active ?? 0),
      inactive: Number(row?.inactive ?? 0),
      personaFisica: Number(row?.personaFisica ?? 0),
      personaMoral: Number(row?.personaMoral ?? 0),
    };
  }
}
