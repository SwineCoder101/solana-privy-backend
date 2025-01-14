import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { JobStatus } from '@prisma/client';

export class UpdateJobDto {
  @ApiProperty({
    example: 'Develop a smart contract',
    description: 'Title of the job',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Need a Solidity developer to create a custom token contract',
    description: 'Detailed description of the job',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100, description: 'Minimum budget for the job' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiProperty({ example: 500, description: 'Maximum budget for the job' })
  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @ApiProperty({ example: 'TON', description: 'Currency for the job budget' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'Current status of the job',
    enum: JobStatus,
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
