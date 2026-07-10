import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export function getTypeOrmOptions(
  configService?: ConfigService,
): TypeOrmModuleOptions {
  const host =
    configService?.get<string>('database.host') ?? process.env.DB_HOST;
  const port = Number(
    configService?.get<number>('database.port') ?? process.env.DB_PORT ?? 5432,
  );
  const database =
    configService?.get<string>('database.name') ?? process.env.DB_NAME;
  const username =
    configService?.get<string>('database.user') ?? process.env.DB_USER;
  const password =
    configService?.get<string>('database.password') ?? process.env.DB_PASSWORD;

  return {
    type: 'postgres',
    host,
    port,
    database,
    username,
    password,
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: false,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
  };
}

const dataSourceOptions: DataSourceOptions = {
  ...(getTypeOrmOptions() as DataSourceOptions),
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
};

export default new DataSource(dataSourceOptions);
