import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthVerifyDto } from './dto/authVerify.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('createToken')
  @HttpCode(HttpStatus.OK)
  async createToken(@Body() authDto: AuthDto) {
    return this.authService.createToken(authDto);
  }

  @Post('validateToken')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() authVerifyDto: AuthVerifyDto) {
    return this.authService.validateToken(authVerifyDto);
  }
}
