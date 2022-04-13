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
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from './file.service';
import { filesUploadDataDTO } from './dto/filesUploadData.dto';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import filenameStorage from 'src/multer/filename.storage';
import destinationStorage from 'src/multer/destination.storage';
import { File } from './entities/file.entity';

import * as fs from 'fs';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @MessagePattern('file/add')
  async create(@Payload() filesData) {
    debugger;
    const res = await this.fileService.create(filesData).catch((err) => {
      const errorMessage =
        err.errno === 1452 ? 'foulderId is not found' : err.sqlMessage;

      return {
        status: false,
        message: errorMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('message/getAll')
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

  @MessagePattern('message/get')
  async findOne(@Payload() fileId: number) {
    const res = await this.fileService.getById(fileId).catch((err) => {
      return {
        status: false,
        message: err.sqlMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('message/getAllChat')
  async update(
    @Body() updateFileDto: filesUploadDataDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    // const fileData = {
    //   ...updateFileDto,
    //   fileName: file.originalname,
    //   fileTempName: file.filename,
    //   size: file.size,
    //   mimetype: file.mimetype,
    // };
    // const res = await this.fileService.update(fileData).catch((err) => {
    //   console.log(err);
    //   const errorMessage =
    //     err.errno === 1452 ? 'foulderId is not found' : err.sqlMessage;
    //   response.status(HttpStatus.BAD_REQUEST).send({
    //     status: false,
    //     message: errorMessage,
    //     httpCode: HttpStatus.BAD_REQUEST,
    //   });
    // });
    // response.send(res);
  }

  @MessagePattern('message/delete')
  async remove(@Payload() fileId: number) {
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

  @MessagePattern('message/getAllChat')
  async getHello(@Payload() fileId: number) {
    // const fileData = await this.fileService.getById(fileId);
    // if (fileData instanceof File) {
    //   const filePath = `${process.env.STORE_PATH}/${fileData.foulder.path}/${fileData.fileTempName}`;
    //   if (fs.existsSync(filePath)) {
    //     // TODO: Пофиксить имя файла при возвращении (скачивании), подсатвлять оригинальное имя, а не временное
    //     response.download(filePath, fileData.fileName);
    //   } else {
    //     response.status(HttpStatus.BAD_REQUEST).send({
    //       status: false,
    //       message: `no such file with id ${fileId}`,
    //       httpCode: HttpStatus.BAD_REQUEST,
    //     });
    //   }
    // } else {
    //   response.status(fileData.httpCode).send({
    //     status: fileData.status,
    //     message: fileData.message,
    //     httpCode: fileData.httpCode,
    //   });
    // }
  }
}
