import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class HeartbeatDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
