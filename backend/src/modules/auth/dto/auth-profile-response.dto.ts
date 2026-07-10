import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/user-role.enum';

export class AuthProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;
}
