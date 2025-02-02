import { Module } from '@nestjs/common';
import { OracleService } from './oracle.service';
import { PrivyModule } from '../../privy/privy.module';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [PrivyModule, ProgramModule],
  providers: [OracleService],
  exports: [OracleService],
})
export class OracleModule {}
