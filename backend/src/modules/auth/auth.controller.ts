import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LoginCommand } from './commands/login.command';
import { AuthProfileResponseDto } from './dto/auth-profile-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT' })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  login(@Body() loginDto: LoginDto) {
    return this.commandBus.execute(
      new LoginCommand(loginDto.email, loginDto.password),
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EXECUTIVE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiResponse({ status: 200, type: AuthProfileResponseDto })
  profile(@CurrentUser() user: AuthProfileResponseDto) {
    return user;
  }
}
