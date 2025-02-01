import { Module } from '@nestjs/common';
import { PrivyService } from './privy.service';

@Module({
  imports: [],
  providers: [PrivyService],
  exports: [PrivyService],
})
export class PrivyModule {}
