import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Supplier } from '../../supplier.entity';
import { User } from '../../../users/user.entity';
import { SupplierType } from '../../supplier-type.enum';
import { SupplierStatus } from '../../supplier-status.enum';
import { SupplierStrategyFactory } from '../../strategies/supplier-strategy-factory';
import { PersonaFisicaValidationStrategy } from '../../strategies/persona-fisica-validation-strategy';
import { PersonaMoralValidationStrategy } from '../../strategies/persona-moral-validation-strategy';
import { CreateSupplierCommandHandler } from './create-supplier.command-handler';
import { CreateSupplierCommand } from '../create-supplier.command';

describe('CreateSupplierCommandHandler', () => {
  let handler: CreateSupplierCommandHandler;
  let supplierRepo: jest.Mocked<Repository<Supplier>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const validDto = {
    supplierType: SupplierType.PERSONA_FISICA,
    firstName: 'Juan',
    lastName: 'Pérez',
    rfc: 'JUAN920101ABC',
    curp: 'JUAN920101HDFLRN01',
    status: undefined,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSupplierCommandHandler,
        SupplierStrategyFactory,
        PersonaFisicaValidationStrategy,
        PersonaMoralValidationStrategy,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get(CreateSupplierCommandHandler);
    supplierRepo = moduleRef.get(getRepositoryToken(Supplier));
    userRepo = moduleRef.get(getRepositoryToken(User));
  });

  it('creates a supplier successfully', async () => {
    const adminUser = { id: 'user-1' } as User;
    userRepo.findOneBy.mockResolvedValue(adminUser);
    supplierRepo.findOne.mockResolvedValue(null);
    supplierRepo.create.mockReturnValue({ id: 'supplier-1' } as Supplier);
    const savedSupplier = {
      id: 'supplier-1',
      createdBy: { id: 'user-1', fullName: 'Admin', email: 'admin@test.com' },
      ...validDto,
      status: SupplierStatus.ACTIVE,
      createdById: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    supplierRepo.save.mockResolvedValue(savedSupplier);
    supplierRepo.findOne
      .mockResolvedValueOnce(null) // first call returns null for uniqueness
      .mockResolvedValueOnce(savedSupplier); // second call returns saved supplier with relations

    const result = await handler.execute(
      new CreateSupplierCommand('user-1', validDto),
    );

    expect(result).toBeDefined();
    expect(result.rfc).toBe('JUAN920101ABC');
  });

  it('throws ConflictException for duplicate RFC', async () => {
    supplierRepo.findOne.mockResolvedValue({ id: 'existing' } as Supplier);

    await expect(
      handler.execute(new CreateSupplierCommand('user-1', validDto as any)),
    ).rejects.toThrow(ConflictException);
  });

  it('throws NotFoundException when user not found', async () => {
    userRepo.findOneBy.mockResolvedValue(null);
    supplierRepo.findOne.mockResolvedValueOnce(null);

    await expect(
      handler.execute(new CreateSupplierCommand('user-1', validDto as any)),
    ).rejects.toThrow(NotFoundException);
  });
});
