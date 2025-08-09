import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@user/controllers/user.controller';
import { User } from '@user/entities/user.entity';
import { UserRepository } from '@user/repositories/user.repository';
import { UserService } from '@user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
