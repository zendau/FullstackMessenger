import { Controller, HttpStatus, Logger, UseFilters } from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { IFoulderDTO } from './dto/foulder.dto';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
@Controller('foulder')
export class FoulderController {
  private readonly logger = new Logger(FoulderController.name);
  constructor(private readonly foulderService: FoulderService) {}

  @MessagePattern('foulder/add')
  async create(@Payload() foulderPath: string) {
    const res = await this.foulderService.create(foulderPath);

    return res;
  }

  @MessagePattern('foulder/getAll')
  async findAll() {
    const res = await this.foulderService.getAll();
    return res;
  }

  @MessagePattern('foulder/get')
  async findOne(@Payload() foulderId: number) {
    const res = await this.foulderService.getById(foulderId);
    return res;
  }

  @MessagePattern('foulder/edit')
  async update(@Payload() updateFoulderDto: IFoulderDTO) {
    const res = await this.foulderService.update(updateFoulderDto);

    return res;
  }

  @MessagePattern('foulder/delete')
  async remove(@Payload() foulderId: number) {
    const res = await this.foulderService.remove(foulderId);
    return res;
  }
}
