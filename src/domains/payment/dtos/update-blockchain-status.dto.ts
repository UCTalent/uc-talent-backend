import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsIn } from 'class-validator';

export class UpdateBlockchainStatusDto {
  @ApiProperty({ 
    description: 'Payment distribution ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  payment_distribution_id: string;

  @ApiProperty({ 
    description: 'Status', 
    example: 'completed',
    enum: ['pending', 'failed', 'completed']
  })
  @IsString()
  @IsIn(['pending', 'failed', 'completed'])
  status: string;

  @ApiProperty({ 
    description: 'Transaction hash', 
    example: '0xabc123...' 
  })
  @IsString()
  transaction_hash: string;
} 