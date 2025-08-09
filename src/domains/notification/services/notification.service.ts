import { Injectable } from '@nestjs/common';

import type { Note } from '@notification/entities/note.entity';
import { NoteRepository } from '@notification/repositories/note.repository';
import { EmailService } from '@notification/services/email.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly emailService: EmailService
  ) {}

  async createNote(data: Partial<Note>): Promise<Note> {
    return this.noteRepository.create(data);
  }

  async findNotesByUserId(userId: string): Promise<Note[]> {
    return this.noteRepository.findByUserId(userId);
  }

  async findNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id);
  }

  async deleteNote(id: string): Promise<void> {
    await this.noteRepository.delete(id);
  }

  async sendNotification(
    userId: string,
    title: string,
    content: string
  ): Promise<Note> {
    return this.createNote({
      userId,
      title,
      content,
    });
  }

  async sendEmailNotification(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    await this.emailService.sendEmail(to, subject, html);
  }
}
