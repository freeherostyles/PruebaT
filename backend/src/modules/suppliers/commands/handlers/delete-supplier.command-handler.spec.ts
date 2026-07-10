import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierType } from '../../supplier-type.enum';
import { SupplierStatus } from '../../supplier-status.enum';
import { DeleteSupplierCommandHandler } from './delete-supplier.command-handler';
import { DeleteSupplierCommand } from '../delete-supplier.command';

describe('DeleteSupplierCommandHandler', () => {
  let handler: DeleteSupplierCommandHandler;
  let supplierRepo: jest.Mocked<Repository<Supplier>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteSupplierCommandHandler,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOneBy: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(DeleteSupplierCommandHandler);
    supplierRepo = moduleRef.get(getRepositoryToken(Supplier));
  });

  it('soft deletes a supplier', async () => {
    const supplier = {
      id: 'supplier-1',
      supplierType: SupplierType.PERSONA_FISICA,
      status: SupplierStatus.ACTIVE,
      rfc: 'JUAN920101ABC',
    } as Supplier;

    supplierRepo.findOneBy.mockResolvedValue(supplier);
    supplierRepo.softRemove.mockResolvedValue(undefined);

    await expect(
      handler.execute(new DeleteSupplierCommand('supplier-1')),
    ).resolves.toBeUndefined();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(supplierRepo.softRemove).toHaveBeenCalled();
  });

  it('throws NotFoundException for non-existing supplier', async () => {
    supplierRepo.findOneBy.mockResolvedValue(null);

    await expect(
      handler.execute(new DeleteSupplierCommand('non-existing')),
    ).rejects.toThrow(NotFoundException);
  });
});
