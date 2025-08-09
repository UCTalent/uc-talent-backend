import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvModule, EnvService } from '@/shared/infrastructure/env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('DATABASE_HOST'),
        port: envService.get('DATABASE_PORT'),
        username: envService.get('DATABASE_USERNAME'),
        password: envService.get('DATABASE_PASSWORD'),
        database: envService.get('DATABASE_NAME'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: envService.get('NODE_ENV') === 'development',
        logging: envService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
