import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { SupplierType } from '../../supplier-type.enum';
import { SupplierStatus } from '../../supplier-status.enum';
import { SupplierStrategyFactory } from '../../strategies/supplier-strategy-factory';
import { PersonaFisicaValidationStrategy } from '../../strategies/persona-fisica-validation-strategy';
import { PersonaMoralValidationStrategy } from '../../strategies/persona-moral-validation-strategy';
import { UpdateSupplierCommandHandler } from './update-supplier.command-handler';
import { UpdateSupplierCommand } from '../update-supplier.command';

describe('UpdateSupplierCommandHandler', () => {
  let handler: UpdateSupplierCommandHandler;
  let supplierRepo: jest.Mocked<Repository<Supplier>>;

  const existingSupplier = {
    id: 'supplier-1',
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.ACTIVE,
    firstName: 'Juan',
    lastName: 'Pérez',
    rfc: 'JUAN920101ABC',
    createdBy: { id: 'user-1', fullName: 'Admin', email: 'admin@test.com' },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Supplier;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateSupplierCommandHandler,
        SupplierStrategyFactory,
        PersonaFisicaValidationStrategy,
        PersonaMoralValidationStrategy,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(UpdateSupplierCommandHandler);
    supplierRepo = moduleRef.get(getRepositoryToken(Supplier));
  });

  it('updates a supplier successfully', async () => {
    supplierRepo.findOne.mockResolvedValue(existingSupplier);
    const updated = { ...existingSupplier, firstName: 'Juan Carlos' };
    supplierRepo.save.mockResolvedValue(updated);
    supplierRepo.findOne
      .mockResolvedValueOnce(existingSupplier)
      .mockResolvedValueOnce(updated);

    const result = await handler.execute(
      new UpdateSupplierCommand('supplier-1', { firstName: 'Juan Carlos' }),
    );

    expect(result).toBeDefined();
    expect(result.firstName).toBe('Juan Carlos');
  });

  it('throws NotFoundException for non-existing supplier', async () => {
    supplierRepo.findOne.mockResolvedValue(null);

    await expect(
      handler.execute(
        new UpdateSupplierCommand('non-existing', { firstName: 'Test' }),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException for duplicate RFC', async () => {
    supplierRepo.findOne
      .mockResolvedValueOnce(existingSupplier) // find supplier to update
      .mockResolvedValueOnce({ id: 'other' } as Supplier); // find duplicate RFC

    await expect(
      handler.execute(
        new UpdateSupplierCommand('supplier-1', {
          rfc: 'AAAA000000000',
        }),
      ),
    ).rejects.toThrow(ConflictException);
  });
});
