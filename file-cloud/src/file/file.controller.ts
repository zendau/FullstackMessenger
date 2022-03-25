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
import { FileService } from './file.service';
import { IFileDTO } from './dto/file.dto';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('add')
  async create(@Body() createFileDto: IFileDTO, @Res() response: Response) {
    const res = await this.fileService.create(createFileDto).catch((err) => {
      console.log(err);

      const errorMessage =
        err.errno === 1452 ? 'foulderId is not found' : err.sqlMessage;

      response.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: errorMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      });
    });
    response.send(res);
  }

  @Get('getAll')
  async findAll() {
    const res = await this.fileService.getAll().catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('get/:id')
  async findOne(@Param('id') fileId: number) {
    const res = await this.fileService.getById(fileId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Patch('edit')
  async update(@Body() updateFileDto: IFileDTO) {
    const res = await this.fileService.update(updateFileDto).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Delete('delete/:id')
  async remove(@Param('id') fileId: number) {
    const res = await this.fileService.remove(fileId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }
}
