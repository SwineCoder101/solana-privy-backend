import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class SendConnectionRequestDto {
  @ApiProperty({ description: 'ID of the user sending the request' })
  @IsNumber()
  senderId: number;

  @ApiProperty({ description: 'ID of the user receiving the request' })
  @IsNumber()
  receiverId: number;

  @ApiProperty({
    description: 'Optional message with the request',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;
}
