import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobModule } from '@job/job.module';
import { AuthorizationModule } from '@shared/cross-cutting/authorization';

import { AdminController } from './controllers/admin.controller';
import { Admin } from './entities/admin.entity';
import { AdminPermission } from './entities/admin-permission.entity';
import { AdminSession } from './entities/admin-session.entity';
import { AuditLog } from './entities/audit-log.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { AdminRepository } from './repositories/admin.repository';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { SystemSettingRepository } from './repositories/system-setting.repository';
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      AuditLog,
      SystemSetting,
      AdminSession,
      AdminPermission,
    ]),
    ConfigModule,
    AuthorizationModule,
    JobModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    AuditLogRepository,
    SystemSettingRepository,
  ],
  exports: [
    AdminService,
    AdminRepository,
    AuditLogRepository,
    SystemSettingRepository,
  ],
})
export class AdminModule {}
