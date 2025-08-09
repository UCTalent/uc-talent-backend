import { DataSource } from 'typeorm';

import type { EnvService } from '@/shared/infrastructure/env';
import { env } from '@/shared/infrastructure/env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
  logging: env.NODE_ENV !== 'production',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
});

export const createDataSource = (envService: EnvService) => {
  return new DataSource({
    type: 'postgres',
    host: envService.get('DATABASE_HOST'),
    port: envService.get('DATABASE_PORT'),
    username: envService.get('DATABASE_USERNAME'),
    password: envService.get('DATABASE_PASSWORD'),
    database: envService.get('DATABASE_NAME'),
    synchronize: false,
    logging: envService.get('NODE_ENV') !== 'production',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
    subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  });
};
