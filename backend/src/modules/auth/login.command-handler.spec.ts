import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginCommand } from './commands/login.command';
import { LoginCommandHandler } from './login.command-handler';
import { PasswordService } from './password.service';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { UsersService } from '../users/users.service';

describe('LoginCommandHandler', () => {
  const baseUser: User = {
    id: 'user-id',
    fullName: 'Admin Providers',
    email: 'admin@providers.local',
    passwordHash: 'hashed-password',
    role: UserRole.ADMIN,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    normalizeEmail: jest.fn(),
  };

  let handler: LoginCommandHandler;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let usersRepository: { save: jest.Mock };

  beforeEach(async () => {
    usersRepository = {
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginCommandHandler,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'auth.jwtSecret') {
                return 'secret';
              }

              if (key === 'auth.jwtExpiresIn') {
                return '1h';
              }

              throw new Error(`Unexpected config key: ${key}`);
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    handler = moduleRef.get(LoginCommandHandler);
    usersService = moduleRef.get(UsersService);
    passwordService = moduleRef.get(PasswordService);
    jwtService = moduleRef.get(JwtService);
    configService = moduleRef.get(ConfigService);
  });

  it('returns token and public user data for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({ ...baseUser });
    passwordService.compare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');

    const result = await handler.execute(
      new LoginCommand('ADMIN@providers.local', 'change_admin_password'),
    );

    expect(usersService.findByEmail.mock.calls[0]).toEqual([
      'admin@providers.local',
    ]);
    expect(passwordService.compare.mock.calls[0]).toEqual([
      'change_admin_password',
      'hashed-password',
    ]);
    expect(jwtService.signAsync.mock.calls[0]).toEqual([
      {
        sub: 'user-id',
        email: 'admin@providers.local',
        role: UserRole.ADMIN,
      },
      {
        secret: 'secret',
        expiresIn: '1h',
      },
    ]);
    expect(result).toEqual({
      accessToken: 'token',
      user: {
        id: 'user-id',
        fullName: 'Admin Providers',
        email: 'admin@providers.local',
        role: UserRole.ADMIN,
      },
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('throws generic invalid credentials when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      handler.execute(new LoginCommand('missing@providers.local', 'password')),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('throws generic invalid credentials when password is incorrect', async () => {
    usersService.findByEmail.mockResolvedValue({ ...baseUser });
    passwordService.compare.mockResolvedValue(false);

    await expect(
      handler.execute(new LoginCommand(baseUser.email, 'bad-password')),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('throws generic invalid credentials when user is inactive', async () => {
    usersService.findByEmail.mockResolvedValue({
      ...baseUser,
      isActive: false,
    });

    await expect(
      handler.execute(new LoginCommand(baseUser.email, 'password')),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('updates lastLoginAt after successful login', async () => {
    const user = { ...baseUser, lastLoginAt: null };
    usersService.findByEmail.mockResolvedValue(user);
    passwordService.compare.mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token');

    await handler.execute(new LoginCommand(baseUser.email, 'password'));

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(usersRepository.save).toHaveBeenCalledWith(user);
  });

  it('uses the same generic error for missing user and wrong password', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    const missingUserError = await handler
      .execute(new LoginCommand('missing@providers.local', 'password'))
      .catch((error: unknown) => error as UnauthorizedException);

    usersService.findByEmail.mockResolvedValue({ ...baseUser });
    passwordService.compare.mockResolvedValue(false);

    const wrongPasswordError = await handler
      .execute(new LoginCommand(baseUser.email, 'bad-password'))
      .catch((error: unknown) => error as UnauthorizedException);

    expect(missingUserError.message).toBe('Invalid credentials');
    expect(wrongPasswordError.message).toBe('Invalid credentials');
    expect(configService.getOrThrow.mock.calls).not.toContainEqual([
      'auth.unknown',
    ]);
  });
});
