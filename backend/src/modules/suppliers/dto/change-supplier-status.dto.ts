import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SupplierStatus } from '../supplier-status.enum';

export class ChangeSupplierStatusDto {
  @ApiProperty({ enum: SupplierStatus })
  @IsEnum(SupplierStatus)
  status: SupplierStatus;
}
