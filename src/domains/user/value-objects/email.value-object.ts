import { IsEmail, IsNotEmpty } from 'class-validator';

export class Email {
  @IsEmail()
  @IsNotEmpty()
  private readonly _value: string;

  constructor(email: string) {
    this._value = email;
  }

  getValue(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
