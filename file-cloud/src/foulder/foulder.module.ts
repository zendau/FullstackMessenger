import { Foulder } from './entities/foulder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { FoulderController } from './foulder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Foulder])],
  controllers: [FoulderController],
  providers: [FoulderService],
  exports: [FoulderService],
})
export class FoulderModule {}
