import { FoulderModule } from '../foulder/foulder.module';
import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([File]), FoulderModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
