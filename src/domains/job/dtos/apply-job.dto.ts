import { IsOptional, IsString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ required: false, description: 'Uploaded resume ID' })
  @IsOptional()
  @IsUUID()
  uploaded_resume_id?: string;

  @ApiProperty({ required: false, description: 'Candidate email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ required: false, description: 'Professional headline' })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiProperty({ required: false, description: 'Web3 wallet address' })
  @IsOptional()
  @IsString()
  web3_wallet_address?: string;

  @ApiProperty({ required: false, description: 'Web3 chain name' })
  @IsOptional()
  @IsString()
  web3_chain_name?: string;
}
