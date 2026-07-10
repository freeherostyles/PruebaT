type EnvVars = Record<string, string | undefined>;

function requireValue(env: EnvVars, key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function parsePort(value: string, key: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${key} must be a valid port`);
  }

  return parsed;
}

function parsePositiveInteger(value: string, key: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer`);
  }

  return parsed;
}

export function validateEnv(env: EnvVars): EnvVars {
  parsePort(requireValue(env, 'PORT'), 'PORT');
  requireValue(env, 'FRONTEND_URL');
  requireValue(env, 'DB_HOST');
  parsePort(requireValue(env, 'DB_PORT'), 'DB_PORT');
  requireValue(env, 'DB_NAME');
  requireValue(env, 'DB_USER');
  requireValue(env, 'DB_PASSWORD');
  requireValue(env, 'JWT_SECRET');
  requireValue(env, 'JWT_EXPIRES_IN');
  parsePositiveInteger(
    requireValue(env, 'BCRYPT_SALT_ROUNDS'),
    'BCRYPT_SALT_ROUNDS',
  );

  return env;
}
