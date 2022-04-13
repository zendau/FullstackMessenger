import IFiles from './interfaces/IFiles';
import { Foulder } from './../foulder/entities/foulder.entity';
import { FoulderService } from './../foulder/foulder.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private foulderService: FoulderService,
  ) {}

  async create(createFilesData: IFiles) {
    const foulder = await this.foulderService.getByPath(createFilesData.path);
    if (!(foulder instanceof Foulder)) {
      return foulder;
    }

    const resInsered = await Promise.all(
      createFilesData.filesData.map(async (file) => {
        const fileInsered = await this.fileRepository.save({
          ...file,
          userId: createFilesData.userId,
          foulder,
        });
        return fileInsered.id;
      }),
    );
    return resInsered;
  }

  async getAll() {
    debugger;
    return await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulder', 'foulder')
      .getMany();
  }

  async getById(id: number) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulder', 'foulder')
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

  async update(updateFileDTO: IFiles) {
    debugger;
    // const file = await this.getById(updateFileDTO.id);
    // if (file instanceof File) {
    //   const error = this.removeFromStorage(file);

    //   if (typeof error === 'string') {
    //     throw new Error(error);
    //   }

    //   const foulder = await this.foulderService.getByPath(updateFileDTO.path);
    //   if (!(foulder instanceof Foulder)) {
    //     return foulder;
    //   }

    //   const res = await this.fileRepository
    //     .createQueryBuilder()
    //     .update()
    //     .set({
    //       fileName: updateFileDTO.fileName,
    //       fileTempName: updateFileDTO.fileTempName,
    //       mimetype: updateFileDTO.mimetype,
    //       size: updateFileDTO.size,
    //       userId: updateFileDTO.userId,
    //       foulder: foulder,
    //     })
    //     .where(`id = ${updateFileDTO.id}`)
    //     .execute();

    //   return !!res.affected;
    // } else {
    //   return file;
    // }
  }

  async removeFromDb(id: number) {
    const file = await this.getById(id);
    if (file instanceof File) {
      const error = this.removeFromStorage(file);

      const res = await this.fileRepository
        .createQueryBuilder()
        .delete()
        .where(`id = ${id}`)
        .execute();

      if (typeof error === 'string') {
        throw new Error(error);
      }

      return !!res.affected;
    } else {
      return file;
    }
  }

  async removeFromStorage(file) {
    fs.unlink(
      `${process.env.STORE_PATH}/${file.foulder.path}/${file.fileTempName}`,
      (err) => {
        if (err && err.code == 'ENOENT') {
          return "File doesn't exist, won't remove it.";
        } else if (err) {
          return 'Error occurred while trying to remove file';
        }
      },
    );
    return true;
  }

  async setFileDataToMessages(messages) {
    const messagesWithFiles = await Promise.all(
      messages.map(async (message: any) => {
        if (message.media.length > 0) {
          message.files = await Promise.all(
            message.media.map(async (file) => {
              return await this.getById(file.fileId);
            }),
          );
          console.log('MESSAGE', message.files);
        }
        return message;
      }),
    );
    return messagesWithFiles;
  }
}
