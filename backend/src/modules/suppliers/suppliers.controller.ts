import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/user-role.enum';
import type { JwtPayload } from '../auth/jwt-payload.type';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ChangeSupplierStatusDto } from './dto/change-supplier-status.dto';
import { ListSuppliersDto } from './dto/list-suppliers.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { SupplierStatsResponseDto } from './dto/supplier-stats-response.dto';
import { CreateSupplierCommand } from './commands/create-supplier.command';
import { UpdateSupplierCommand } from './commands/update-supplier.command';
import { ChangeSupplierStatusCommand } from './commands/change-supplier-status.command';
import { DeleteSupplierCommand } from './commands/delete-supplier.command';
import { GetSupplierByIdQuery } from './queries/get-supplier-by-id.query';
import { ListSuppliersQuery } from './queries/list-suppliers.query';
import { GetSupplierStatsQuery } from './queries/get-supplier-stats.query';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a supplier (ADMIN only)' })
  async create(
    @Body() dto: CreateSupplierDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<SupplierResponseDto> {
    return this.commandBus.execute(new CreateSupplierCommand(user.sub, dto));
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EXECUTIVE)
  @ApiOperation({
    summary: 'List suppliers with pagination, search and filters',
  })
  async list(@Query() dto: ListSuppliersDto): Promise<{
    data: SupplierResponseDto[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.queryBus.execute(new ListSuppliersQuery(dto));
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get supplier stats' })
  async stats(): Promise<SupplierStatsResponseDto> {
    return this.queryBus.execute(new GetSupplierStatsQuery());
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EXECUTIVE)
  @ApiOperation({ summary: 'Get supplier by ID' })
  async getById(@Param('id') id: string): Promise<SupplierResponseDto> {
    return this.queryBus.execute(new GetSupplierByIdQuery(id));
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a supplier (ADMIN only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.commandBus.execute(new UpdateSupplierCommand(id, dto));
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change supplier status (ADMIN only)' })
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeSupplierStatusDto,
  ): Promise<SupplierResponseDto> {
    return this.commandBus.execute(
      new ChangeSupplierStatusCommand(id, dto.status),
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a supplier (ADMIN only)' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteSupplierCommand(id));
  }
}
