import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { JobStatus } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({
    example: 'Develop a smart contract',
    description: 'Title of the job',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Need a Solidity developer to create a custom token contract',
    description: 'Detailed description of the job',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 100, description: 'Minimum budget for the job' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budgetMin: number;

  @ApiProperty({ example: 500, description: 'Maximum budget for the job' })
  @IsNotEmpty()
  @IsNumber()
  budgetMax: number;

  @ApiProperty({
    example: 'TON',
    description: 'Currency for the job budget',
    default: 'TON',
  })
  @IsString()
  currency: string = 'TON';

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the job',
    enum: JobStatus,
  })
  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.OPEN;

  @ApiProperty({ example: 1, description: 'ID of the user posting the job' })
  @IsNotEmpty()
  @IsNumber()
  posterId: number;

  @ApiProperty({
    example: ['blockchain', 'developer relations'],
    description: 'At least one category for the job',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one category must be provided' })
  @IsString({ each: true })
  categories: string[];
}
