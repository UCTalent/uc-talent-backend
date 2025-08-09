import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateJobStatusDto {
  @ApiProperty({ description: 'Job status', example: 'active' })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Reason for status change',
    example: 'Approved by admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Admin ID', example: 'admin-uuid' })
  @IsString()
  adminId: string;
}
