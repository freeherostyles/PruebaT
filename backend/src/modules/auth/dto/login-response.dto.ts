import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/user-role.enum';

export class AuthenticatedUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user: AuthenticatedUserDto;
}
