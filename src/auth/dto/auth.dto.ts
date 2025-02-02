import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '9999999999', description: 'The username' })
  telegramId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 21, description: 'The password' })
  userId: number;
}
