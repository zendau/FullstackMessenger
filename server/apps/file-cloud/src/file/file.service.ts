import IFiles from './interfaces/IFiles';
import { Foulder } from '../foulder/entities/foulder.entity';
import { FoulderService } from '../foulder/foulder.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import * as fs from 'fs';
import { DetailedRpcException } from '@lib/exception';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private foulderService: FoulderService,
  ) {}

  async create(createFilesData: IFiles) {
    try {
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
          return fileInsered;
        }),
      );
      return resInsered;
    } catch (e) {
      const errorMessage =
        e.errno === 1452 ? ['error.notFoundFoulder'] : 'error.unexpected';

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async getAll() {
    return await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulder', 'foulder')
      .getMany();
  }

  async getById(fileId: number) {
    console.log('test', fileId);
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.foulder', 'foulder')
      .where('file.id = :fileId', { fileId })
      .getOne();

    if (res === undefined)
      throw new DetailedRpcException(
        ['error.notFoundFile', fileId],
        HttpStatus.BAD_REQUEST,
      );

    return res;
  }

  async removeMany(idList: number[]) {
    const resRemoveStatuses = await Promise.all(
      idList.map(async (fileId) => {
        const fileData = await this.getById(fileId);

        if ('status' in fileData) {
          return [fileId, false];
        }

        const resDeleted = await this.fileRepository
          .createQueryBuilder()
          .delete()
          .where('id = :fileId', { fileId })
          .execute();

        const deletedStatus = !!resDeleted.affected;

        if (deletedStatus) {
          this.removeFromStorage(fileData.fileTempName, fileData.foulder.path);
        }

        return [fileId, deletedStatus];
      }),
    );
    return resRemoveStatuses;
  }

  async removeFromStorage(fileName: string, filePath: string) {
    fs.unlink(`${process.env.STORE_PATH}/${filePath}/${fileName}`, (err) => {
      if (err && err.code == 'ENOENT') {
        return "File doesn't exist, won't remove it.";
      } else if (err) {
        return 'Error occurred while trying to remove file';
      }
    });
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

  async isFileExist(fileId: number) {
    const file = await this.getById(fileId);

    if ('status' in file) {
      return false;
    }

    const filePath = `${process.env.STORE_PATH}/${file.foulder.path}/${file.fileTempName}`;
    if (fs.existsSync(filePath)) {
      return file;
    }

    return false;
  }
}
