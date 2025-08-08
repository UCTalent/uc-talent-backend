import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Speciality } from './entities/speciality.entity';
import { Role } from './entities/role.entity';
import { SkillService } from './services/skill.service';
import { SpecialityService } from './services/speciality.service';
import { RoleService } from './services/role.service';
import { SkillController } from './controllers/skill.controller';
import { SpecialityController } from './controllers/speciality.controller';
import { RoleController } from './controllers/role.controller';
import { SkillRepository } from './repositories/skill.repository';
import { SpecialityRepository } from './repositories/speciality.repository';
import { RoleRepository } from './repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Speciality, Role])],
  providers: [
    SkillService,
    SpecialityService,
    RoleService,
    SkillRepository,
    SpecialityRepository,
    RoleRepository,
  ],
  controllers: [SkillController, SpecialityController, RoleController],
  exports: [SkillService, SpecialityService, RoleService],
})
export class SkillModule {}
