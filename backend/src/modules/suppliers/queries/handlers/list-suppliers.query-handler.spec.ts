import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { ListSuppliersQueryHandler } from './list-suppliers.query-handler';
import { ListSuppliersQuery } from '../list-suppliers.query';
import { SupplierType } from '../../supplier-type.enum';
import { SupplierStatus } from '../../supplier-status.enum';

describe('ListSuppliersQueryHandler', () => {
  let handler: ListSuppliersQueryHandler;
  let supplierRepo: jest.Mocked<Repository<Supplier>>;

  const mockQueryBuilder = () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      clone: jest.fn(),
    };
    qb.clone.mockReturnValue(qb);
    return qb;
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListSuppliersQueryHandler,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(ListSuppliersQueryHandler);
    supplierRepo = moduleRef.get(getRepositoryToken(Supplier));
  });

  it('returns paginated results', async () => {
    const qb = mockQueryBuilder();
    qb.getManyAndCount.mockResolvedValue([[], 0]);
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    const result = await handler.execute(
      new ListSuppliersQuery({ page: 1, limit: 10 }),
    );

    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
    expect(result.data).toEqual([]);
  });

  it('applies type filter', async () => {
    const qb = mockQueryBuilder();
    qb.getManyAndCount.mockResolvedValue([[{ id: '1' } as Supplier], 1]);
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    await handler.execute(
      new ListSuppliersQuery({
        page: 1,
        limit: 10,
        type: SupplierType.PERSONA_FISICA,
      }),
    );

    expect(qb.andWhere).toHaveBeenCalledWith('s.supplier_type = :type', {
      type: SupplierType.PERSONA_FISICA,
    });
  });

  it('applies status filter', async () => {
    const qb = mockQueryBuilder();
    qb.getManyAndCount.mockResolvedValue([[{ id: '1' } as Supplier], 1]);
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    await handler.execute(
      new ListSuppliersQuery({
        page: 1,
        limit: 10,
        status: SupplierStatus.ACTIVE,
      }),
    );

    expect(qb.andWhere).toHaveBeenCalledWith('s.status = :status', {
      status: SupplierStatus.ACTIVE,
    });
  });

  it('excludes soft deleted records', async () => {
    const qb = mockQueryBuilder();
    qb.getManyAndCount.mockResolvedValue([[], 0]);
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    await handler.execute(new ListSuppliersQuery({ page: 1, limit: 10 }));

    expect(qb.where).toHaveBeenCalledWith('s.deleted_at IS NULL');
  });
});
