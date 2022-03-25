import { Module } from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { FoulderController } from './foulder.controller';

@Module({
  controllers: [FoulderController],
  providers: [FoulderService]
})
export class FoulderModule {}
