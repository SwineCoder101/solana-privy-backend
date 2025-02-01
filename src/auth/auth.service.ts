import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { AuthVerifyDto } from './dto/authVerify.dto';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(authDto: AuthDto) {
    const payload = { username: authDto.telegramId, sub: authDto.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  async validateToken(authVerifyDto: AuthVerifyDto) {
    return {
      access_token: this.jwtService.verify(authVerifyDto.token, {
        secret: process.env.JWT_SECRET_KEY,
      }),
    };
  }
}
