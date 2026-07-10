import 'reflect-metadata';
import bcrypt from 'bcrypt';
import dataSource from '../typeorm.config';
import { User } from '../../modules/users/user.entity';
import { UserRole } from '../../modules/users/user-role.enum';

type SeedUser = {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function run() {
  const saltRounds = Number(requireEnv('BCRYPT_SALT_ROUNDS'));

  const users: SeedUser[] = [
    {
      fullName: 'Admin Providers',
      email: 'admin@providers.local',
      role: UserRole.ADMIN,
      password: requireEnv('DEV_ADMIN_PASSWORD'),
    },
    {
      fullName: 'Executive Providers',
      email: 'executive@providers.local',
      role: UserRole.EXECUTIVE,
      password: requireEnv('DEV_EXECUTIVE_PASSWORD'),
    },
  ];

  await dataSource.initialize();

  try {
    const usersRepository = dataSource.getRepository(User);

    for (const userData of users) {
      const email = userData.email.trim().toLowerCase();
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      const user = usersRepository.create({
        fullName: userData.fullName,
        email,
        passwordHash,
        role: userData.role,
        isActive: true,
        lastLoginAt: null,
      });

      await usersRepository.upsert(user, ['email']);
    }
  } finally {
    await dataSource.destroy();
  }
}

void run();
