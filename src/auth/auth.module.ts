import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
@Module({ imports: [
  JwtModule.register({
      secret: 'somerandomsecret',
  }),
],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
