import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Country } from './country.entity';
import { User } from '@user/entities/user.entity';
import { Organization } from '@organization/entities/organization.entity';
import { Job } from '@job/entities/job.entity';

@Entity('cities')
export class City extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  nameAscii: string;

  @Column({ nullable: true })
  countryId: string;

  // Relationships
  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(() => User, (user) => user.locationCity)
  users: User[];

  @OneToMany(() => Organization, (organization) => organization.city)
  organizations: Organization[];

  @OneToMany(() => Job, (job) => job.city)
  jobs: Job[];
} 