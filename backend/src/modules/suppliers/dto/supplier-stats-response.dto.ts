import { ApiProperty } from '@nestjs/swagger';

export class SupplierStatsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  active: number;

  @ApiProperty()
  inactive: number;

  @ApiProperty()
  personaFisica: number;

  @ApiProperty()
  personaMoral: number;
}
