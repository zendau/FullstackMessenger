import { Foulder } from './entities/foulder.entity';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IFoulderDTO } from './dto/foulder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { DetailedRpcException } from '@lib/exception';

@Injectable()
export class FoulderService {
  private readonly logger = new Logger(FoulderService.name);
  constructor(
    @InjectRepository(Foulder)
    private foulderRepository: Repository<Foulder>,
  ) {}

  async create(foulderPath: string) {
    const foulderExist = await this.getByPath(foulderPath);
    if (
      'status' in foulderExist &&
      foulderExist.message[0] === 'error.notFoundFoulderPath'
    ) {
      const dir = `${process.env.STORE_PATH}/${foulderPath}`;
      fs.mkdir(dir, (err) => {
        if (err) {
          throw new DetailedRpcException(
            'error.unexpected',
            HttpStatus.BAD_REQUEST,
          );
        }
      });
      const resInsered = await this.foulderRepository.save({
        path: foulderPath,
      });
      return resInsered;
    } else {
      throw new DetailedRpcException(
        ['error.foulderExist', foulderPath],
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll() {
    return await this.foulderRepository.createQueryBuilder().getMany();
  }

  async getById(id: number) {
    const res = await this.foulderRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();

    if (res === undefined)
      throw new DetailedRpcException(
        ['error.notFoundFoulder', id],
        HttpStatus.BAD_REQUEST,
      );

    return res;
  }

  async getByPath(path: string) {
    const res = await this.foulderRepository
      .createQueryBuilder()
      .where('path = :path', { path })
      .getOne();

    if (res === undefined)
      return {
        status: false,
        message: ['error.notFoundFoulderPath', path],
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateFoulderDTO: IFoulderDTO) {
    const currFoulderExist = await this.getById(updateFoulderDTO.id);
    if (currFoulderExist instanceof Foulder) {
      const newFoulderExist = await this.getByPath(updateFoulderDTO.path);
      if ('status' in newFoulderExist) {
        const currNameDir = `${process.env.STORE_PATH}/${currFoulderExist.path}`;
        const newNameDir = `${process.env.STORE_PATH}/${updateFoulderDTO.path}`;
        fs.rename(currNameDir, newNameDir, (err) => {
          if (err) {
            throw new DetailedRpcException(
              'error.unexpected',
              HttpStatus.BAD_REQUEST,
            );
          }
        });
        const res = await this.foulderRepository
          .createQueryBuilder()
          .update()
          .set({
            path: updateFoulderDTO.path,
          })
          .where(`id = ${updateFoulderDTO.id}`)
          .execute();

        return !!res.affected;
      } else {
        throw new DetailedRpcException(
          ['error.foulderExist', updateFoulderDTO.path],
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new DetailedRpcException(
        ['error.notFoundFoulder', updateFoulderDTO.id],
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    const foulderExist = await this.getById(id);
    if (foulderExist instanceof Foulder) {
      const dir = `${process.env.STORE_PATH}/${foulderExist.path}`;

      fs.rm(dir, { recursive: true }, (err) => {
        if (err) {
          throw new DetailedRpcException(
            'error.unexpected',
            HttpStatus.BAD_REQUEST,
          );
        }
      });

      const res = await this.foulderRepository
        .createQueryBuilder()
        .delete()
        .where(`id = ${id}`)
        .execute();

      return !!res.affected;
    } else {
      throw new DetailedRpcException(
        ['error.notFoundFoulder', id],
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
