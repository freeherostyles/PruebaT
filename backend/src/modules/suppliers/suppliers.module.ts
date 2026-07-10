import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Supplier } from './supplier.entity';
import { SuppliersController } from './suppliers.controller';
import { SupplierStrategyFactory } from './strategies/supplier-strategy-factory';
import { PersonaFisicaValidationStrategy } from './strategies/persona-fisica-validation-strategy';
import { PersonaMoralValidationStrategy } from './strategies/persona-moral-validation-strategy';
import { CreateSupplierCommandHandler } from './commands/handlers/create-supplier.command-handler';
import { UpdateSupplierCommandHandler } from './commands/handlers/update-supplier.command-handler';
import { ChangeSupplierStatusCommandHandler } from './commands/handlers/change-supplier-status.command-handler';
import { DeleteSupplierCommandHandler } from './commands/handlers/delete-supplier.command-handler';
import { GetSupplierByIdQueryHandler } from './queries/handlers/get-supplier-by-id.query-handler';
import { ListSuppliersQueryHandler } from './queries/handlers/list-suppliers.query-handler';
import { GetSupplierStatsQueryHandler } from './queries/handlers/get-supplier-stats.query-handler';

const commandHandlers = [
  CreateSupplierCommandHandler,
  UpdateSupplierCommandHandler,
  ChangeSupplierStatusCommandHandler,
  DeleteSupplierCommandHandler,
];

const queryHandlers = [
  GetSupplierByIdQueryHandler,
  ListSuppliersQueryHandler,
  GetSupplierStatsQueryHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Supplier]), UsersModule],
  controllers: [SuppliersController],
  providers: [
    SupplierStrategyFactory,
    PersonaFisicaValidationStrategy,
    PersonaMoralValidationStrategy,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class SuppliersModule {}
