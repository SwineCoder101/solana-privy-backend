import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AuthVerifyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'secrettoken',description: 'The token' })
  token: string;
}