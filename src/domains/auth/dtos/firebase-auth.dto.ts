import { IsString } from 'class-validator';

export class FirebaseAuthDto {
  @IsString()
  firebase_token: string;
}
