import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'User status', example: 'suspended' })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Reason for status change',
    example: 'Violation of terms',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Admin ID', example: 'admin-uuid' })
  @IsString()
  adminId: string;
}
