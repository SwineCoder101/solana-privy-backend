import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: '1234567890',
    description: 'Telegram ID can be a string or bigint',
  })
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({
    example: '0x123456789abcdef123456789abcdef1234567890',
    description: 'Wallet address of the user',
  })
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({ example: 'johndoegrammed', description: 'Username of the user' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Profile photo URL',
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: false, description: 'Is the user a bot?' })
  @IsBoolean()
  @IsOptional()
  isBot?: boolean;

  @ApiProperty({ example: true, description: 'Is the user a premium member?' })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({ example: 'en', description: 'User language code' })
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiProperty({ example: true, description: 'Allows user to receive PMs?' })
  @IsBoolean()
  @IsOptional()
  allowsWriteToPm?: boolean;

  @ApiProperty({
    example: false,
    description: 'Is user added to attachment menu?',
  })
  @IsBoolean()
  @IsOptional()
  addedToAttachmentMenu?: boolean;

  @ApiProperty({
    example: 'Developer with Web3 experience',
    description: 'Short description',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['Developer', 'Designer'],
    description: 'Freelancer roles',
  })
  @IsOptional()
  freelancerRoleTypes?: string[];

  @ApiProperty({
    example: 'https://example.com/story',
    description: 'Story link',
  })
  @IsString()
  @IsOptional()
  storyLink?: string;

  @ApiProperty({
    example: 0,
    description: 'Stories posted by user on X & other social media',
  })
  @IsOptional()
  @IsNumber()
  storyLinkCounter?: number;

  @ApiProperty({ example: 4, description: 'User Telegram age' })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({ example: false, description: 'Is the user currently online?' })
  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @ApiProperty({
    example: 'user_123456789_inv_abcdef',
    description: 'Invite link for the user',
  })
  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  inviteLink?: string;

  @ApiProperty({
    required: false,
    example: 'user_987654321_inv_ghijkl',
    description: 'Invite link of the referrer',
  })
  @IsOptional()
  @IsString()
  referrerInviteLink?: string;

}
