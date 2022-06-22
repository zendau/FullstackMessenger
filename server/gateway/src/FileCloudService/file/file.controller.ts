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
  HttpStatus,
} from '@nestjs/common';
import { filesUploadDataDTO } from './dto/filesUploadData.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import destinationStorage from '../multer/destination.storage';
import filenameStorage from '../multer/filename.storage';

import * as fs from 'fs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { diskStorage } from 'multer';

import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorDTO } from 'src/AuthService/ResponseDTO/httpError.dto';
import { FileDTO } from './dto/file.dto';
import { fileEditDataDTO } from './dto/filesEditData.dto';

@ApiBearerAuth()
@ApiTags('FileCloud microservice - File controller')
@Controller('file')
export class FileController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}


  @ApiOperation({ summary: 'Files upload data with `files` interceptor' })
  @ApiResponse({ status: 200, type: Number, isArray: true, description: 'return uploaded files id' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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


  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, type: FileDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Get file by id' })
  @ApiResponse({ status: 200, type: FileDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Edit files by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Put('edit')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destinationStorage,
        filename: filenameStorage,
      }),
    }),
  )
  async update(
    @Body() updateFileDto: fileEditDataDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
   
    const filesData = {
      ...updateFileDto,
      filesData: files.map((file) => {
        return {
          fileName: file.originalname,
          fileTempName: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        };
      }),
    };
    console.log('files', filesData)
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/edit', filesData),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Delete file by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
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

  @ApiOperation({ summary: 'Download file fron server by id' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('download/:id')
  async dowloadFile(@Res() response: Response, @Param('id') fileId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/get', fileId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    const filePath = `${process.env.STORE_PATH}/${res.foulder.path}/${res.fileTempName}`;
    if (fs.existsSync(filePath)) {
      response.download(filePath, res.fileName);
    } else {
      response.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: `no such file with id ${fileId}`,
        httpCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
