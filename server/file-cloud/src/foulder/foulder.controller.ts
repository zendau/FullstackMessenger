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
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('foulder')
export class FoulderController {
  constructor(private readonly foulderService: FoulderService) {}

  @MessagePattern('foulder/add')
  async create(@Payload() createFoulderDto: IFoulderDTO) {
    debugger;
    const res = await this.foulderService
      .create(createFoulderDto)
      .catch((err) => {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('foulder/getAll')
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

  @MessagePattern('foulder/get')
  async findOne(@Payload() foulderId: number) {
    const res = await this.foulderService.getById(foulderId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
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
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      });
    return res;
  }

  @MessagePattern('foulder/delete')
  async remove(@Payload() foulderId: number) {
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
