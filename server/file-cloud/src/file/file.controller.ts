import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import destinationStorage from './multer/destination.storage';
import filenameStorage from './multer/filename.storage';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private readonly fileService: FileService) {}

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
    @Body()
    filesUploadDTO: {
      path: string;
      userId: number;
    },
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('filesUploadDTO', files, filesUploadDTO);
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
    console.log('filesData', filesData);
    const res = await this.fileService.create(filesData).catch((err) => {
      const errorMessage =
        err.errno === 1452 ? ['error.notFoundFoulder'] : 'error.unexpected';

      return {
        status: false,
        message: errorMessage,
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('file/getAll')
  async findAll() {
    const res = await this.fileService.getAll().catch((err) => {
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('file/get')
  async findOne(@Payload() fileId: number) {
    const res = await this.fileService.getById(fileId).catch((err) => {
      console.log('err', err);
      this.logger.error(err.sqlMessage);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @MessagePattern('file/deleteMany')
  async remove(@Payload() fileList: any[]) {
    const res = await this.fileService.removeMany(fileList).catch((err) => {
      this.logger.error(err.sqlMessage ?? err.message);
      return {
        status: false,
        message: 'error.unexpected',
        httpCode: HttpStatus.BAD_REQUEST,
      };
    });
    return res;
  }

  @Get('download/:id')
  async dowloadFile(
    @Res() response: Response,
    @Param('id', ParseIntPipe) fileId: number,
  ) {
    const fileData = await this.fileService.isFileExist(fileId);
    console.log('!!!', fileId, fileData);
    if (fileData) {
      const filePath = `${process.env.STORE_PATH}/${fileData.foulder.path}/${fileData.fileTempName}`;
      response.download(filePath, fileData.fileName);
    } else {
      response.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: ['error.notFoundFile', fileId],
        httpCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
