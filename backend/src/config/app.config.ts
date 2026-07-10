import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.PORT ?? 3187),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:4178',
}));
