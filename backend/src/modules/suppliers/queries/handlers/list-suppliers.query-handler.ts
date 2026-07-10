import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierResponseDto } from '../../dto/supplier-response.dto';
import { ListSuppliersQuery } from '../list-suppliers.query';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
@QueryHandler(ListSuppliersQuery)
export class ListSuppliersQueryHandler implements IQueryHandler<ListSuppliersQuery> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async execute(
    query: ListSuppliersQuery,
  ): Promise<PaginatedResult<SupplierResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query.dto;

    const qb = this.supplierRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.createdBy', 'u')
      .where('s.deleted_at IS NULL');

    if (search) {
      const term = `%${search}%`;
      qb.andWhere(
        '(s.rfc ILIKE :search OR s.first_name ILIKE :search OR s.last_name ILIKE :search OR s.second_last_name ILIKE :search OR s.business_name ILIKE :search OR s.trade_name ILIKE :search OR s.email ILIKE :search OR s.phone ILIKE :search)',
        { search: term },
      );
    }

    if (type) {
      qb.andWhere('s.supplier_type = :type', { type });
    }

    if (status) {
      qb.andWhere('s.status = :status', { status });
    }

    const columnMap: Record<string, string> = {
      createdAt: 's.createdAt',
      updatedAt: 's.updatedAt',
      rfc: 's.rfc',
      status: 's.status',
      supplierType: 's.supplierType',
      firstName: 's.firstName',
      lastName: 's.lastName',
      businessName: 's.businessName',
    };

    const orderColumn = columnMap[sortBy] || 's.createdAt';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(orderColumn, order);

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [suppliers, total] = await qb.getManyAndCount();

    const data = suppliers.map((s) => SupplierResponseDto.fromEntity(s));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
