import { Foulder } from './entities/foulder.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { IFoulderDTO } from './dto/foulder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class FoulderService {
  constructor(
    @InjectRepository(Foulder)
    private foulderRepository: Repository<Foulder>,
  ) {}

  async create(createFoulderDTO: IFoulderDTO) {
    const resInsered = await this.foulderRepository.save(createFoulderDTO);
    return resInsered;
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
      return {
        status: false,
        message: `foulderId ${id} is not valid`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

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
        message: `foulder path - ${path} is not found`,
        httpCode: HttpStatus.BAD_REQUEST,
      };

    return res;
  }

  async update(updateFoulderDTO: IFoulderDTO) {
    const res = await this.foulderRepository
      .createQueryBuilder()
      .update()
      .set({
        path: updateFoulderDTO.path,
      })
      .where(`id = ${updateFoulderDTO.id}`)
      .execute();

    return !!res.affected;
  }

  async remove(id: number) {
    const res = await this.foulderRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${id}`)
      .execute();

    return !!res.affected;
  }
}
