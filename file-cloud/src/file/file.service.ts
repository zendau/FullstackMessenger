import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFileDTO } from './dto/file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(createFileDTO: IFileDTO) {
    const resInsered = await this.fileRepository.save(createFileDTO);
    console.log(resInsered);
    return resInsered;
  }

  async getAll() {
    return await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulderId', 'foulder')
      .getMany();
  }

  async getById(id: number) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulderId', 'foulder')
      .where('file.id = :id', { id })
      .getOne();

    if (res === undefined)
      return {
        status: false,
        message: `fileId ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateFileDTO: IFileDTO) {
    const res = await this.fileRepository
      .createQueryBuilder()
      .update()
      .set({
        fileName: updateFileDTO.fileName,
        fileTempName: updateFileDTO.fileTempName,
        foulderId: updateFileDTO.foulderId,
        userId: updateFileDTO.userId,
      })
      .where(`id = ${updateFileDTO.id}`)
      .execute();

    return !!res.affected;
  }

  async remove(id: number) {
    const res = await this.fileRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${id}`)
      .execute();

    return !!res.affected;
  }
}
