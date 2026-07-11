import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { GetSupplierStatsQueryHandler } from './get-supplier-stats.query-handler';
import { GetSupplierStatsQuery } from '../get-supplier-stats.query';

describe('GetSupplierStatsQueryHandler', () => {
  let handler: GetSupplierStatsQueryHandler;
  let supplierRepo: jest.Mocked<Repository<Supplier>>;

  const mockQueryBuilder = (rawResult: Record<string, string>) => {
    const qb = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(rawResult),
    };
    return qb;
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetSupplierStatsQueryHandler,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(GetSupplierStatsQueryHandler);
    supplierRepo = moduleRef.get(getRepositoryToken(Supplier));
  });

  it('returns correct stats', async () => {
    const qb = mockQueryBuilder({
      total: '10',
      active: '7',
      inactive: '3',
      personaFisica: '6',
      personaMoral: '4',
    });
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    const result = await handler.execute(new GetSupplierStatsQuery());

    expect(result).toEqual({
      total: 10,
      active: 7,
      inactive: 3,
      personaFisica: 6,
      personaMoral: 4,
    });
  });

  it('excludes soft deleted records', async () => {
    const qb = mockQueryBuilder({
      total: '0',
      active: '0',
      inactive: '0',
      personaFisica: '0',
      personaMoral: '0',
    });
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    await handler.execute(new GetSupplierStatsQuery());

    expect(qb.where).toHaveBeenCalledWith('s.deleted_at IS NULL');
  });

  it('handles null result from getRawOne', async () => {
    const qb = mockQueryBuilder(undefined as unknown as Record<string, string>);
    qb.getRawOne.mockResolvedValue(undefined);
    supplierRepo.createQueryBuilder.mockReturnValue(qb);

    const result = await handler.execute(new GetSupplierStatsQuery());

    expect(result).toEqual({
      total: 0,
      active: 0,
      inactive: 0,
      personaFisica: 0,
      personaMoral: 0,
    });
  });
});
