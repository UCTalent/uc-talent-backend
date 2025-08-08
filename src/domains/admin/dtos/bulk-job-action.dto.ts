import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class BulkJobActionDto {
  @ApiProperty({ description: 'Action to perform', example: 'approve' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'Job IDs', example: ['job-1', 'job-2', 'job-3'] })
  @IsArray()
  @IsString({ each: true })
  jobIds: string[];

  @ApiProperty({
    description: 'Reason for action',
    example: 'Bulk approval',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Admin ID', example: 'admin-uuid' })
  @IsString()
  adminId: string;
}
