import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { IFoulderDTO } from './dto/foulder.dto';
import { Response } from 'express';

@Controller('foulder')
export class FoulderController {
  constructor(private readonly foulderService: FoulderService) {}

  @Post('add')
  async create(
    @Body() createFoulderDto: IFoulderDTO,
    @Res() response: Response,
  ) {
    const res = await this.foulderService
      .create(createFoulderDto)
      .catch((err) => {
        response.status(HttpStatus.BAD_REQUEST).send({
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        });
      });
    response.send(res);
  }

  @Get('getAll')
  async findAll() {
    const res = await this.foulderService.getAll().catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('get/:id')
  async findOne(@Param('id') foulderId: number) {
    const res = await this.foulderService.getById(foulderId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Patch('edit')
  async update(@Body() updateFoulderDto: IFoulderDTO) {
    const res = await this.foulderService
      .update(updateFoulderDto)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') foulderId: number) {
    const res = await this.foulderService.remove(foulderId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
