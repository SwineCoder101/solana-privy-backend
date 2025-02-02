import { Module } from '@nestjs/common';
import { PrivyService } from './privy.service';
import { ProgramModule } from 'src/solana/program/program.module';

@Module({
  imports: [ProgramModule],
  providers: [PrivyService],
  exports: [PrivyService],
})
export class PrivyModule {}
