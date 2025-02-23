import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PythService } from './pyth.service';

@Module({
  imports: [HttpModule],
  providers: [PythService],
  exports: [PythService],
})
export class PythModule {}
