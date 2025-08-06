import { Entity, Column, Index, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';
import { Experience } from './experience.entity';
import { Education } from './education.entity';
import { ExternalLink } from './external-link.entity';
import { UploadedResume } from './uploaded-resume.entity';
import { RecommendationJob } from './recommendation-job.entity';
import { Speciality } from '@skill/entities/speciality.entity';
import { Skill } from '@skill/entities/skill.entity';
import { Role } from '@skill/entities/role.entity';

export enum EmploymentStatus {
  AVAILABLE_NOW = 'available_now',
  OPEN_TO_OPPORTUNITIES = 'open_to_opportunities',
  JUST_BROWSING = 'just_browsing',
}

export enum EnglishProficiency {
  BASIC = 'basic',
  CONVERSATIONAL = 'conversational',
  FLUENT = 'fluent',
  NATIVE = 'native',
}

export enum TalentStatus {
  NEW_PROFILE = 'new_profile',
  UNDER_REVIEW = 'under_review',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity('talents')
export class Talent extends BaseEntity {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'About section',
    example: 'Experienced software developer...',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  about: string;

  @ApiProperty({
    description: 'Employment status',
    enum: EmploymentStatus,
    example: EmploymentStatus.AVAILABLE_NOW,
  })
  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.JUST_BROWSING,
  })
  employmentStatus: EmploymentStatus;

  @ApiProperty({
    description: 'English proficiency level',
    enum: EnglishProficiency,
    example: EnglishProficiency.FLUENT,
  })
  @Column({
    type: 'enum',
    enum: EnglishProficiency,
    default: EnglishProficiency.CONVERSATIONAL,
  })
  englishProficiency: EnglishProficiency;

  @ApiProperty({
    description: 'Experience level in years',
    example: 5,
  })
  @Column({ default: 0 })
  experienceLevel: number;

  @ApiProperty({
    description: 'Management level',
    example: 2,
  })
  @Column({ default: 0 })
  managementLevel: number;

  @ApiProperty({
    description: 'Talent status',
    enum: TalentStatus,
    example: TalentStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: TalentStatus,
    default: TalentStatus.NEW_PROFILE,
  })
  status: TalentStatus;

  @ApiProperty({
    description: 'Profile completion step',
    example: 3,
  })
  @Column({ default: 0 })
  step: number;

  @ApiProperty({
    description: 'Professional headline',
    example: 'Senior Software Engineer',
    required: false,
  })
  @Column({ nullable: true })
  headline: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.talents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Experience, (experience) => experience.talent)
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.talent)
  educations: Education[];

  @OneToMany(() => ExternalLink, (link) => link.talent)
  externalLinks: ExternalLink[];

  @OneToMany(() => UploadedResume, (resume) => resume.talent)
  uploadedResumes: UploadedResume[];

  @OneToMany(() => RecommendationJob, (recommendation) => recommendation.talent)
  recommendationJobs: RecommendationJob[];

  @ManyToMany(() => Speciality)
  @JoinTable({
    name: 'talent_specialities',
    joinColumn: { name: 'talentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specialityId', referencedColumnName: 'id' },
  })
  specialities: Speciality[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'talent_skills',
    joinColumn: { name: 'talentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'talent_roles',
    joinColumn: { name: 'talentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];
} 