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

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'http';
import { DataSource, Repository } from 'typeorm';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/users/user.entity';
import { Supplier } from '../src/modules/suppliers/supplier.entity';
import { UserRole } from '../src/modules/users/user-role.enum';
import { SupplierType } from '../src/modules/suppliers/supplier-type.enum';
import { SupplierStatus } from '../src/modules/suppliers/supplier-status.enum';
import { LoginResponseDto } from '../src/modules/auth/dto/login-response.dto';
import { SupplierResponseDto } from '../src/modules/suppliers/dto/supplier-response.dto';
import { SupplierStatsResponseDto } from '../src/modules/suppliers/dto/supplier-stats-response.dto';

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

describe('SuppliersController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let usersRepository: Repository<User>;
  let suppliersRepository: Repository<Supplier>;
  let adminToken: string;
  let executiveToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
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
    suppliersRepository = dataSource.getRepository(Supplier);

    await seedUsers();
    await loginUsers();
  });

  afterAll(async () => {
    await app.close();
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

  async function loginUsers() {
    const adminResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'admin@providers.local',
        password: 'change_admin_password',
      })
      .expect(201);
    adminToken = (adminResponse.body as LoginResponseDto).accessToken;

    const executiveResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: 'executive@providers.local',
        password: 'change_executive_password',
      })
      .expect(201);
    executiveToken = (executiveResponse.body as LoginResponseDto).accessToken;
  }

  async function createTestSupplier(
    token: string,
    overrides: Record<string, unknown> = {},
    expectedStatus = 201,
  ) {
    const defaultPayload = {
      supplierType: SupplierType.PERSONA_FISICA,
      firstName: 'Test',
      lastName: 'User',
      rfc: `TEST${Date.now().toString().slice(-6)}ABC`,
    };

    const response = await request(httpServer)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...defaultPayload, ...overrides })
      .expect(expectedStatus);

    return response;
  }

  describe('Authentication and Authorization', () => {
    it('returns 401 without token', async () => {
      await request(httpServer).get('/api/suppliers').expect(401);
    });

    it('allows EXECUTIVE to list suppliers', async () => {
      await request(httpServer)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${executiveToken}`)
        .expect(200);
    });

    it('allows EXECUTIVE to get supplier detail', async () => {
      const createRes = await createTestSupplier(adminToken);
      const supplier = createRes.body as SupplierResponseDto;

      await request(httpServer)
        .get(`/api/suppliers/${supplier.id}`)
        .set('Authorization', `Bearer ${executiveToken}`)
        .expect(200);

      await suppliersRepository.delete(supplier.id);
    });

    it('returns 403 for EXECUTIVE creating a supplier', async () => {
      await createTestSupplier(executiveToken, {}, 403);
    });

    it('returns 403 for EXECUTIVE editing a supplier', async () => {
      const createRes = await createTestSupplier(adminToken);
      const supplier = createRes.body as SupplierResponseDto;

      await request(httpServer)
        .patch(`/api/suppliers/${supplier.id}`)
        .set('Authorization', `Bearer ${executiveToken}`)
        .send({ firstName: 'Hacked' })
        .expect(403);

      await suppliersRepository.delete(supplier.id);
    });

    it('returns 403 for EXECUTIVE deleting a supplier', async () => {
      const createRes = await createTestSupplier(adminToken);
      const supplier = createRes.body as SupplierResponseDto;

      await request(httpServer)
        .delete(`/api/suppliers/${supplier.id}`)
        .set('Authorization', `Bearer ${executiveToken}`)
        .expect(403);

      await suppliersRepository.delete(supplier.id);
    });
  });

  describe('CRUD Operations', () => {
    it('creates a persona física', async () => {
      const res = await createTestSupplier(adminToken);
      const body = res.body as SupplierResponseDto;

      expect(body.id).toEqual(expect.any(String));
      expect(body.supplierType).toBe(SupplierType.PERSONA_FISICA);
      expect(body.status).toBe(SupplierStatus.ACTIVE);
      expect(body.rfc).toEqual(expect.any(String));
      expect(body.createdBy).toBeDefined();
      expect(body.createdBy.id).toEqual(expect.any(String));

      createdSupplierId = body.id;
    });

    it('creates a persona moral', async () => {
      const res = await request(httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          supplierType: SupplierType.PERSONA_MORAL,
          businessName: 'Test Corp S.A. de C.V.',
          rfc: `COR${Date.now().toString().slice(-6)}ABC`,
        })
        .expect(201);

      const body = res.body as SupplierResponseDto;
      expect(body.supplierType).toBe(SupplierType.PERSONA_MORAL);
      expect(body.businessName).toBe('Test Corp S.A. de C.V.');

      await suppliersRepository.delete(body.id);
    });

    it('returns 409 for duplicate RFC', async () => {
      const res = await createTestSupplier(adminToken);
      const supplier = res.body as SupplierResponseDto;

      await request(httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          supplierType: SupplierType.PERSONA_FISICA,
          firstName: 'Dup',
          lastName: 'User',
          rfc: supplier.rfc,
        })
        .expect(409);

      await suppliersRepository.delete(supplier.id);
    });

    it('gets supplier detail', async () => {
      const res = await createTestSupplier(adminToken);
      const created = res.body as SupplierResponseDto;

      const getRes = await request(httpServer)
        .get(`/api/suppliers/${created.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = getRes.body as SupplierResponseDto;
      expect(body.id).toBe(created.id);
      expect(body.rfc).toBe(created.rfc);

      await suppliersRepository.delete(created.id);
    });

    it('updates a supplier', async () => {
      const res = await createTestSupplier(adminToken);
      const created = res.body as SupplierResponseDto;

      const updateRes = await request(httpServer)
        .patch(`/api/suppliers/${created.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'Updated' })
        .expect(200);

      const body = updateRes.body as SupplierResponseDto;
      expect(body.firstName).toBe('Updated');

      await suppliersRepository.delete(created.id);
    });

    it('changes supplier status', async () => {
      const res = await createTestSupplier(adminToken);
      const created = res.body as SupplierResponseDto;

      const statusRes = await request(httpServer)
        .patch(`/api/suppliers/${created.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: SupplierStatus.INACTIVE })
        .expect(200);

      const body = statusRes.body as SupplierResponseDto;
      expect(body.status).toBe(SupplierStatus.INACTIVE);

      await suppliersRepository.delete(created.id);
    });

    it('deletes a supplier (soft delete)', async () => {
      const res = await createTestSupplier(adminToken);
      const created = res.body as SupplierResponseDto;

      await request(httpServer)
        .delete(`/api/suppliers/${created.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      await request(httpServer)
        .get(`/api/suppliers/${created.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('lists suppliers with pagination', async () => {
      await createTestSupplier(adminToken, { firstName: 'List1' });
      await createTestSupplier(adminToken, { firstName: 'List2' });

      const res = await request(httpServer)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      const body = res.body as PaginatedResponse<SupplierResponseDto>;
      expect(body.data).toBeDefined();
      expect(body.meta).toBeDefined();
      expect(body.meta.page).toBe(1);
      expect(body.meta.total).toBeGreaterThanOrEqual(2);

      await suppliersRepository.delete({ firstName: 'List1' });
      await suppliersRepository.delete({ firstName: 'List2' });
    });

    it('filters suppliers by type', async () => {
      const res = await request(httpServer)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ type: SupplierType.PERSONA_FISICA })
        .expect(200);

      const body = res.body as PaginatedResponse<SupplierResponseDto>;
      expect(body.data).toBeDefined();
    });

    it('filters suppliers by status', async () => {
      const res = await request(httpServer)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ status: SupplierStatus.ACTIVE })
        .expect(200);

      const body = res.body as PaginatedResponse<SupplierResponseDto>;
      expect(body.data).toBeDefined();
    });

    it('searches suppliers by RFC or name', async () => {
      const res = await createTestSupplier(adminToken, {
        firstName: 'Searchable',
      });
      const created = res.body as SupplierResponseDto;

      const searchRes = await request(httpServer)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'Searchable' })
        .expect(200);

      const searchBody =
        searchRes.body as PaginatedResponse<SupplierResponseDto>;
      expect(searchBody.data.length).toBeGreaterThanOrEqual(1);

      await suppliersRepository.delete(created.id);
    });
  });

  describe('Stats', () => {
    it('returns stats with correct structure', async () => {
      const res = await request(httpServer)
        .get('/api/suppliers/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as SupplierStatsResponseDto;
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('active');
      expect(body).toHaveProperty('inactive');
      expect(body).toHaveProperty('personaFisica');
      expect(body).toHaveProperty('personaMoral');
      expect(typeof body.total).toBe('number');
    });
  });
});
