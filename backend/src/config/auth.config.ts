import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
}));
