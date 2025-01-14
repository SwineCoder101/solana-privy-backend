import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isBot?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  allowsWriteToPm?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  addedToAttachmentMenu?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  freelancerRoleTypes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inviteLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storyLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  storyLinkCounter?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    required: false,
    example: false,
    description: 'Is the user currently online?',
  })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}
