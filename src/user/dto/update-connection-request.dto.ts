import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class UpdateConnectionRequestDto {
  @ApiProperty({
    enum: RequestStatus,
    description: 'New status for the request',
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
