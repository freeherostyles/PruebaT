import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SupplierType } from '../supplier-type.enum';
import { SupplierStatus } from '../supplier-status.enum';
import { Supplier } from '../supplier.entity';

class CreatedByDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;
}

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SupplierType })
  supplierType: SupplierType;

  @ApiProperty({ enum: SupplierStatus })
  status: SupplierStatus;

  @ApiPropertyOptional()
  firstName?: string | null;

  @ApiPropertyOptional()
  lastName?: string | null;

  @ApiPropertyOptional()
  secondLastName?: string | null;

  @ApiPropertyOptional()
  businessName?: string | null;

  @ApiPropertyOptional()
  tradeName?: string | null;

  @ApiProperty()
  rfc: string;

  @ApiPropertyOptional()
  curp?: string | null;

  @ApiPropertyOptional()
  contactPerson?: string | null;

  @ApiPropertyOptional()
  email?: string | null;

  @ApiPropertyOptional()
  phone?: string | null;

  @ApiProperty()
  createdById: string;

  @ApiProperty({ type: CreatedByDto })
  createdBy: CreatedByDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(supplier: Supplier): SupplierResponseDto {
    const dto = new SupplierResponseDto();
    dto.id = supplier.id;
    dto.supplierType = supplier.supplierType;
    dto.status = supplier.status;
    dto.firstName = supplier.firstName;
    dto.lastName = supplier.lastName;
    dto.secondLastName = supplier.secondLastName;
    dto.businessName = supplier.businessName;
    dto.tradeName = supplier.tradeName;
    dto.rfc = supplier.rfc;
    dto.curp = supplier.curp;
    dto.contactPerson = supplier.contactPerson;
    dto.email = supplier.email;
    dto.phone = supplier.phone;
    dto.createdById = supplier.createdBy?.id ?? '';
    if (supplier.createdBy) {
      dto.createdBy = {
        id: supplier.createdBy.id,
        fullName: supplier.createdBy.fullName,
        email: supplier.createdBy.email,
      };
    }
    dto.createdAt = supplier.createdAt;
    dto.updatedAt = supplier.updatedAt;
    return dto;
  }
}
