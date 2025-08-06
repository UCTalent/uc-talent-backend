import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReferCandidateDto {
  @ApiProperty({ description: 'Candidate name' })
  @IsString()
  candidate_name: string;

  @ApiProperty({ description: 'Candidate email' })
  @IsEmail()
  candidate_email: string;

  @ApiProperty({ required: false, description: 'Candidate phone number' })
  @IsOptional()
  @IsString()
  candidate_phonenumber?: string;

  @ApiProperty({ required: false, description: 'Candidate introduction' })
  @IsOptional()
  @IsString()
  candidate_introduction?: string;

  @ApiProperty({ required: false, description: 'Recommendation text' })
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiProperty({ required: false, description: 'Web3 wallet address' })
  @IsOptional()
  @IsString()
  web3_wallet_address?: string;

  @ApiProperty({ required: false, description: 'Web3 signature' })
  @IsOptional()
  @IsString()
  web3_signature?: string;

  @ApiProperty({ required: false, description: 'Web3 chain name' })
  @IsOptional()
  @IsString()
  web3_chain_name?: string;
} 