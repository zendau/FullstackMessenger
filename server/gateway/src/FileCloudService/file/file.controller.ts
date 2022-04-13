import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UploadedFiles,
  Res,
  Inject,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { filesUploadDataDTO } from './dto/filesUploadData.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import destinationStorage from '../multer/destination.storage';
import filenameStorage from '../multer/filename.storage';

import * as fs from 'fs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { diskStorage } from 'multer';

@Controller('file')
export class FileController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @Post('add')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destinationStorage,
        filename: filenameStorage,
      }),
    }),
  )
  async create(
    @Body() filesUploadDTO: filesUploadDataDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    debugger;
    const filesData = {
      ...filesUploadDTO,
      filesData: files.map((file) => {
        return {
          fileName: file.originalname,
          fileTempName: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        };
      }),
    };

    const res = await firstValueFrom(
      this.fileServiceClient.send('file/add', filesData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Get('getAll')
  async findAll() {
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/getAll', ''),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Get('get/:id')
  async findOne(@Param('id') fileId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/get', fileId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
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
    @Body() updateFileDto: filesUploadDataDTO,
    @UploadedFile() file: Express.Multer.File,
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

  @Delete('delete/:id')
  async remove(@Param('id') fileId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/delete', fileId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @Get('download/:id')
  async getHello(@Param('id') fileId: number) {
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
