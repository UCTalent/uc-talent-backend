import { IsString } from 'class-validator';

export class Web3AuthDto {
  @IsString()
  jwt_token: string;
}