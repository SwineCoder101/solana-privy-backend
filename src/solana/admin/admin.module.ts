import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [ProgramModule],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
