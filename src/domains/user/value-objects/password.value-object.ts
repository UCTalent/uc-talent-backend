import * as bcrypt from 'bcrypt';
import { IsNotEmpty, MinLength } from 'class-validator';

export class Password {
  @IsNotEmpty()
  @MinLength(8)
  private readonly value: string;

  constructor(password: string) {
    this.value = password;
  }

  getValue(): string {
    return this.value;
  }

  async hash(): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(this.value, saltRounds);
  }

  async encrypt(): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(this.value, saltRounds);
  }

  async compare(hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(this.value, hashedPassword);
  }

  static async verify(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
