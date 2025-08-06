import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '@infrastructure/email/email.module';
import { Note } from './entities/note.entity';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';
import { JobMailer } from './mailers/job.mailer';
import { UserMailer } from './mailers/user.mailer';
import { NoteRepository } from './repositories/note.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    EmailModule, // Import EmailModule thay vì MailerModule
  ],
  providers: [
    EmailService,
    NotificationService,
    JobMailer,
    UserMailer,
    NoteRepository,
  ],
  exports: [EmailService, NotificationService, JobMailer, UserMailer],
})
export class NotificationModule {} 