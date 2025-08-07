import { IsString, IsOptional } from 'class-validator';

export class Web3AuthDto {
  @IsString()
  jwt: string;

  @IsString()
  @IsOptional()
  client_id?: string;

  @IsString()
  @IsOptional()
  client_secret?: string;
}