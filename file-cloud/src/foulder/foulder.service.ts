import { Injectable } from '@nestjs/common';
import { CreateFoulderDto } from './dto/create-foulder.dto';
import { UpdateFoulderDto } from './dto/update-foulder.dto';

@Injectable()
export class FoulderService {
  create(createFoulderDto: CreateFoulderDto) {
    return 'This action adds a new foulder';
  }

  findAll() {
    return `This action returns all foulder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foulder`;
  }

  update(id: number, updateFoulderDto: UpdateFoulderDto) {
    return `This action updates a #${id} foulder`;
  }

  remove(id: number) {
    return `This action removes a #${id} foulder`;
  }
}
