import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileService } from './file.service';
import { IFileDTO } from './dto/file.dto';
import e, { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import filenameStorage from 'src/multer/filename.storage';
import destinationStorage from 'src/multer/destination.storage';
import { File } from './entities/file.entity';

import * as fs from 'fs';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destinationStorage,
        filename: filenameStorage,
      }),
    }),
  )
  async create(
    @Body() createFileDto: IFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    const fileData = {
      ...createFileDto,
      fileName: file.originalname,
      fileTempName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };

    const res = await this.fileService.create(fileData).catch((err) => {
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
      console.log(err);
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

  @Put('edit')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: destinationStorage,
        filename: filenameStorage,
      }),
    }),
  )
  async update(
    @Body() updateFileDto: IFileDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    const fileData = {
      ...updateFileDto,
      fileName: file.originalname,
      fileTempName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };

    const res = await this.fileService.update(fileData).catch((err) => {
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

  @Delete('delete/:id')
  async remove(@Param('id') fileId: number) {
    const res = await this.fileService.removeFromDb(fileId).catch((err) => {
      if (err.sqlMessage) {
        return {
          status: false,
          message: err.sqlMessage,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      } else {
        return {
          status: false,
          message: err.message,
          httpCode: HttpStatus.BAD_REQUEST,
        };
      }
    });
    return res;
  }

  @Get('download/:id')
  async getHello(@Res() response: Response, @Param('id') fileId: number) {
    const fileData = await this.fileService.getById(fileId);
    if (fileData instanceof File) {
      const filePath = `${process.env.STORE_PATH}/${fileData.foulder.path}/${fileData.fileTempName}`;
      if (fs.existsSync(filePath)) {
        response.download(filePath);
      } else {
        response.status(HttpStatus.BAD_REQUEST).send({
          status: false,
          message: `no such file with id ${fileId}`,
          httpCode: HttpStatus.BAD_REQUEST,
        });
      }
    } else {
      response.status(fileData.httpCode).send({
        status: fileData.status,
        message: fileData.message,
        httpCode: fileData.httpCode,
      });
    }
  }
}
