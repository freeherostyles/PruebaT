import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'providers-postgres',
  port: Number(process.env.DB_PORT ?? 5432),
  name: process.env.DB_NAME ?? 'providers_db',
  user: process.env.DB_USER ?? 'providers_user',
  password: process.env.DB_PASSWORD ?? 'providers_password',
}));
