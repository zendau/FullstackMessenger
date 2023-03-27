import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { IFoulderDTO } from './dto/foulder.dto';

import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('foulder')
export class FoulderController {
  private readonly logger = new Logger(FoulderController.name);
  constructor(private readonly foulderService: FoulderService) {}

  @MessagePattern('foulder/add')
  async create(@Payload() foulderPath: string) {
    const res = await this.foulderService.create(foulderPath).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });

    return res;
  }

  @MessagePattern('foulder/getAll')
  async findAll() {
    const res = await this.foulderService.getAll().catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('foulder/get')
  async findOne(@Payload() foulderId: number) {
    const res = await this.foulderService.getById(foulderId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('foulder/edit')
  async update(@Payload() updateFoulderDto: IFoulderDTO) {
    const res = await this.foulderService
      .update(updateFoulderDto)
      .catch((err) => {
        this.logger.error(err.sqlMessage);
        return {
          status: false,
          message: 'error.unexpected',
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('foulder/delete')
  async remove(@Payload() foulderId: number) {
    const res = await this.foulderService.remove(foulderId).catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
