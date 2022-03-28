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
  UseInterceptors,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { IFileDTO } from './dto/file.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const storagePath = './storage';
          let path = req.body.path;

          if (path.charAt(0) !== '/') {
            path = '/' + path;
          }
          const filePath = storagePath + path;

          if (fs.existsSync(filePath)) {
            cb(null, filePath);
          } else {
            cb(new HttpException('wrong path', HttpStatus.BAD_REQUEST), null);
          }
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid.v4()}${extname(file.originalname)}`);
        },
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
}
