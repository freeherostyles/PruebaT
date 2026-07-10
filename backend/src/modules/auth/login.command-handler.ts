import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { Repository } from 'typeorm';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginCommand } from './commands/login.command';
import { JwtPayload } from './jwt-payload.type';
import { PasswordService } from './password.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const email = command.email.trim().toLowerCase();
    const invalidCredentialsError = new UnauthorizedException(
      'Invalid credentials',
    );

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw invalidCredentialsError;
    }

    const isPasswordValid = await this.passwordService.compare(
      command.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw invalidCredentialsError;
    }

    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const expiresIn = this.configService.getOrThrow<string>(
      'auth.jwtExpiresIn',
    ) as StringValue;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
      expiresIn,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
