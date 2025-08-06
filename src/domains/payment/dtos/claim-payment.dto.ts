import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClaimPaymentDataDto {
  @ApiProperty({ 
    description: 'Job ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  job_id: string;

  @ApiProperty({ 
    description: 'Payment distribution ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  payment_distribution_id: string;
}

export class ClaimPaymentDto {
  @ApiProperty({ 
    description: 'Payment distributions data', 
    type: ClaimPaymentDataDto 
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ClaimPaymentDataDto)
  payment_distributions: ClaimPaymentDataDto;
} 