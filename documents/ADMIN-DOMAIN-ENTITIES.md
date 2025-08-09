# Admin Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Admin domain trong NestJS.

## 🗄️ Database Entities

### 1. Admin Entity

```typescript
// admin.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { AuditLog } from './audit-log.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  // Relationships
  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[];
}
```

### 2. AuditLog Entity

```typescript
// audit-log.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Admin } from './admin.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  action: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'target_type', nullable: true })
  targetType: string;

  @Column({ name: 'target_id', nullable: true })
  targetId: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  // Relationships
  @ManyToOne(() => Admin, (admin) => admin.auditLogs)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
```

### 3. SystemSetting Entity

```typescript
// system-setting.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';

@Entity('system_settings')
export class SystemSetting extends BaseEntity {
  @Column({ unique: true })
  @Index()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'string' })
  type: string; // string, number, boolean, json

  @Column({ default: false })
  encrypted: boolean;
}
```

### 4. AdminSession Entity

```typescript
// admin-session.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Admin } from './admin.entity';

@Entity('admin_sessions')
export class AdminSession extends BaseEntity {
  @Column({ name: 'session_token' })
  @Index()
  sessionToken: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Admin, (admin) => admin.sessions)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
```

### 5. AdminPermission Entity

```typescript
// admin-permission.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Admin } from './admin.entity';

@Entity('admin_permissions')
export class AdminPermission extends BaseEntity {
  @Column({ unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  resource: string; // users, jobs, talents, payments

  @Column()
  action: string; // create, read, update, delete

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToMany(() => Admin, (admin) => admin.permissions)
  @JoinTable({
    name: 'admin_permission_mappings',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'admin_id', referencedColumnName: 'id' },
  })
  admins: Admin[];
}
```

## 🗄️ Database Migrations

### 1. Create Admins Table

```typescript
// 1700000000012-CreateAdmins.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAdmins1700000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'first_name', type: 'varchar' },
          { name: 'last_name', type: 'varchar' },
          { name: 'role', type: 'varchar', default: "'admin'" },
          { name: 'status', type: 'varchar', default: "'active'" },
          { name: 'last_login_at', type: 'timestamp', isNullable: true },
          { name: 'login_attempts', type: 'integer', default: 0 },
          { name: 'locked_until', type: 'timestamp', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'admins',
      new TableIndex({
        name: 'IDX_ADMINS_EMAIL',
        columnNames: ['email'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins');
  }
}
```

### 2. Create AuditLogs Table

```typescript
// 1700000000013-CreateAuditLogs.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateAuditLogs1700000000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'action', type: 'varchar' },
          { name: 'admin_id', type: 'uuid' },
          { name: 'target_type', type: 'varchar', isNullable: true },
          { name: 'target_id', type: 'uuid', isNullable: true },
          { name: 'details', type: 'jsonb', isNullable: true },
          { name: 'ip_address', type: 'varchar', isNullable: true },
          { name: 'user_agent', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_LOGS_ADMIN_ID',
        columnNames: ['admin_id'],
      })
    );
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_LOGS_ACTION',
        columnNames: ['action'],
      })
    );
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_LOGS_CREATED_AT',
        columnNames: ['created_at'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs');
  }
}
```

### 3. Create SystemSettings Table

```typescript
// 1700000000014-CreateSystemSettings.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSystemSettings1700000000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'system_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'key', type: 'varchar', isUnique: true },
          { name: 'value', type: 'text' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'type', type: 'varchar', default: "'string'" },
          { name: 'encrypted', type: 'boolean', default: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'system_settings',
      new TableIndex({
        name: 'IDX_SYSTEM_SETTINGS_KEY',
        columnNames: ['key'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('system_settings');
  }
}
```

### 4. Create AdminSessions Table

```typescript
// 1700000000015-CreateAdminSessions.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateAdminSessions1700000000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'session_token', type: 'varchar' },
          { name: 'admin_id', type: 'uuid' },
          { name: 'expires_at', type: 'timestamp' },
          { name: 'ip_address', type: 'varchar', isNullable: true },
          { name: 'user_agent', type: 'varchar', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'admin_sessions',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'admin_sessions',
      new TableIndex({
        name: 'IDX_ADMIN_SESSIONS_TOKEN',
        columnNames: ['session_token'],
      })
    );
    await queryRunner.createIndex(
      'admin_sessions',
      new TableIndex({
        name: 'IDX_ADMIN_SESSIONS_ADMIN_ID',
        columnNames: ['admin_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin_sessions');
  }
}
```

## 🔧 Repositories

### 1. Admin Repository

```typescript
// admin.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {
    super(adminRepository);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async findActiveAdmins(): Promise<Admin[]> {
    return this.adminRepository.find({ where: { status: 'active' } });
  }

  async incrementLoginAttempts(id: string): Promise<void> {
    await this.adminRepository.increment({ id }, 'loginAttempts', 1);
  }

  async resetLoginAttempts(id: string): Promise<void> {
    await this.adminRepository.update(id, {
      loginAttempts: 0,
      lockedUntil: null,
    });
  }
}
```

### 2. AuditLog Repository

```typescript
// audit-log.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {
    super(auditLogRepository);
  }

  async findByAdmin(
    adminId: string,
    options?: { page?: number; limit?: number }
  ): Promise<[AuditLog[], number]> {
    const { page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    return this.auditLogRepository.findAndCount({
      where: { adminId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async findByAction(
    action: string,
    options?: { page?: number; limit?: number }
  ): Promise<[AuditLog[], number]> {
    const { page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    return this.auditLogRepository.findAndCount({
      where: { action },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async log(data: {
    action: string;
    adminId: string;
    targetType?: string;
    targetId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(auditLog);
  }
}
```

### 3. SystemSetting Repository

```typescript
// system-setting.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class SystemSettingRepository extends BaseRepository<SystemSetting> {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly systemSettingRepository: Repository<SystemSetting>
  ) {
    super(systemSettingRepository);
  }

  async findByKey(key: string): Promise<SystemSetting | null> {
    return this.systemSettingRepository.findOne({ where: { key } });
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    const setting = await this.findByKey(key);
    if (!setting) return defaultValue;

    switch (setting.type) {
      case 'number':
        return Number(setting.value);
      case 'boolean':
        return setting.value === 'true';
      case 'json':
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  }

  async setValue(
    key: string,
    value: any,
    description?: string
  ): Promise<SystemSetting> {
    let setting = await this.findByKey(key);

    if (!setting) {
      setting = this.systemSettingRepository.create({
        key,
        value: String(value),
        description,
        type:
          typeof value === 'number'
            ? 'number'
            : typeof value === 'boolean'
              ? 'boolean'
              : 'string',
      });
    } else {
      setting.value = String(value);
      if (description) setting.description = description;
    }

    return this.systemSettingRepository.save(setting);
  }
}
```

## 🔐 Admin Authentication

### 1. Admin JWT Strategy

```typescript
// admin-jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      type: 'admin',
    };
  }
}
```

### 2. Admin Guard

```typescript
// admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'admin') {
        throw new ForbiddenException('Admin access required');
      }
      request['admin'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

---

## 📋 Checklist

- [ ] Admin Entity
- [ ] AuditLog Entity
- [ ] SystemSetting Entity
- [ ] AdminSession Entity
- [ ] AdminPermission Entity
- [ ] Database Migrations
- [ ] Admin Repository
- [ ] AuditLog Repository
- [ ] SystemSetting Repository
- [ ] Admin JWT Strategy
- [ ] Admin Guard
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
