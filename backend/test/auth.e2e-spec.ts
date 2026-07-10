process.env.PORT = process.env.PORT ?? '3187';
process.env.FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4178';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5547';
process.env.DB_NAME = process.env.DB_NAME ?? 'providers_db';
process.env.DB_USER = process.env.DB_USER ?? 'providers_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'providers_password';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ?? '10';
process.env.DEV_ADMIN_PASSWORD =
  process.env.DEV_ADMIN_PASSWORD ?? 'change_admin_password';
process.env.DEV_EXECUTIVE_PASSWORD =
  process.env.DEV_EXECUTIVE_PASSWORD ?? 'change_executive_password';

import {
  Controller,
  Get,
  INestApplication,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'http';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { User } from '../src/modules/users/user.entity';
import { UserRole } from '../src/modules/users/user-role.enum';
import { LoginResponseDto } from '../src/modules/auth/dto/login-response.dto';
import { AuthProfileResponseDto } from '../src/modules/auth/dto/auth-profile-response.dto';

@Controller('auth-test')
class AuthTestController {
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOnly() {
    return { status: 'ok' };
  }
}

type ErrorResponse = {
  message: string;
  statusCode: number;
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AuthTestController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    httpServer = app.getHttpServer() as Server;

    const dataSource = app.get(DataSource);
    await dataSource.runMigrations();
    usersRepository = dataSource.getRepository(User);
    jwtService = app.get(JwtService);

    await seedUsers();
  });

  afterAll(async () => {
    if (usersRepository) {
      await restoreUsers();
    }

    await app.close();
  });

  it('logs in as ADMIN and returns accessToken', async () => {
    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'admin@providers.local',
        password: 'change_admin_password',
      })
      .expect(201);

    const body = response.body as unknown as LoginResponseDto;

    expect(body.accessToken).toEqual(expect.any(String));
    expect(typeof body.user.id).toBe('string');
    expect(body.user.fullName).toBe('Admin Providers');
    expect(body.user.email).toBe('admin@providers.local');
    expect(body.user.role).toBe('ADMIN');
    expect(body.user).not.toHaveProperty('passwordHash');
  });

  it('returns authenticated profile with the expected shape', async () => {
    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'admin@providers.local',
        password: 'change_admin_password',
      })
      .expect(201);

    const loginBody = loginResponse.body as unknown as LoginResponseDto;

    const response = await request(httpServer)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);

    const profile = response.body as unknown as AuthProfileResponseDto;

    expect(typeof profile.id).toBe('string');
    expect(profile.fullName).toBe('Admin Providers');
    expect(profile.email).toBe('admin@providers.local');
    expect(profile.role).toBe('ADMIN');
    expect(profile.isActive).toBe(true);
  });

  it('logs in as EXECUTIVE and returns the correct role', async () => {
    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'executive@providers.local',
        password: 'change_executive_password',
      })
      .expect(201);

    const body = response.body as unknown as LoginResponseDto;
    expect(body.user.role).toBe('EXECUTIVE');
  });

  it('returns 401 for invalid credentials', async () => {
    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'admin@providers.local',
        password: 'bad-password',
      })
      .expect(401);

    const body = response.body as unknown as ErrorResponse;
    expect(body.message).toBe('Invalid credentials');
  });

  it('returns 401 on profile without token', async () => {
    await request(httpServer).get('/api/auth/profile').expect(401);
  });

  it('returns 401 on profile with malformed token', async () => {
    await request(httpServer)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer malformed-token')
      .expect(401);
  });

  it('returns 401 on profile with token signed with wrong secret', async () => {
    const invalidToken = await jwtService.signAsync(
      {
        sub: 'test-user',
        email: 'admin@providers.local',
        role: UserRole.ADMIN,
      },
      {
        secret: 'wrong-secret',
        expiresIn: '1h',
      },
    );

    await request(httpServer)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);
  });

  it('returns 401 on profile with expired token', async () => {
    const expiredToken = await jwtService.signAsync(
      {
        sub: 'test-user',
        email: 'admin@providers.local',
        role: UserRole.ADMIN,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1ms',
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 25));

    await request(httpServer)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  it('returns 401 when an inactive user tries to log in and restores the user afterwards', async () => {
    const user = await usersRepository.findOneByOrFail({
      email: 'executive@providers.local',
    });

    user.isActive = false;
    await usersRepository.save(user);

    try {
      await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: 'executive@providers.local',
          password: 'change_executive_password',
        })
        .expect(401);
    } finally {
      user.isActive = true;
      await usersRepository.save(user);
    }
  });

  it('allows ADMIN on an ADMIN-only protected route', async () => {
    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'admin@providers.local',
        password: 'change_admin_password',
      })
      .expect(201);

    const body = loginResponse.body as LoginResponseDto;

    await request(httpServer)
      .get('/api/auth-test/admin-only')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(200);
  });

  it('returns 403 for EXECUTIVE on an ADMIN-only protected route', async () => {
    const loginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'executive@providers.local',
        password: 'change_executive_password',
      })
      .expect(201);

    const body = loginResponse.body as LoginResponseDto;

    await request(httpServer)
      .get('/api/auth-test/admin-only')
      .set('Authorization', `Bearer ${body.accessToken}`)
      .expect(403);
  });

  async function seedUsers() {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? '10');
    const adminPasswordHash = await bcrypt.hash(
      process.env.DEV_ADMIN_PASSWORD ?? 'change_admin_password',
      saltRounds,
    );
    const executivePasswordHash = await bcrypt.hash(
      process.env.DEV_EXECUTIVE_PASSWORD ?? 'change_executive_password',
      saltRounds,
    );

    await usersRepository.upsert(
      [
        {
          fullName: 'Admin Providers',
          email: 'admin@providers.local',
          passwordHash: adminPasswordHash,
          role: UserRole.ADMIN,
          isActive: true,
          lastLoginAt: null,
        },
        {
          fullName: 'Executive Providers',
          email: 'executive@providers.local',
          passwordHash: executivePasswordHash,
          role: UserRole.EXECUTIVE,
          isActive: true,
          lastLoginAt: null,
        },
      ],
      ['email'],
    );
  }

  async function restoreUsers() {
    await usersRepository.update(
      { email: 'admin@providers.local' },
      { isActive: true },
    );
    await usersRepository.update(
      { email: 'executive@providers.local' },
      { isActive: true },
    );
  }
});
