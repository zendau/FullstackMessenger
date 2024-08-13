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
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import destinationStorage from './multer/destination.storage';
import filenameStorage from './multer/filename.storage';
import { DetailedRpcExceptionsFilter } from '@lib/exception';

@UseFilters(new DetailedRpcExceptionsFilter())
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
    const res = await this.fileService.create(filesData);
    return res;
  }

  @MessagePattern('file/getAll')
  async findAll() {
    const res = await this.fileService.getAll();
    return res;
  }

  @MessagePattern('file/get')
  async findOne(@Payload() fileId: number) {
    const res = await this.fileService.getById(fileId);
    return res;
  }

  @MessagePattern('file/deleteMany')
  async remove(@Payload() fileList: any[]) {
    const res = await this.fileService.removeMany(fileList);
    return res;
  }

  @Get('download/:id')
  async dowloadFile(
    @Res() response: Response,
    @Param('id', ParseIntPipe) fileId: number,
  ) {
    const fileData = await this.fileService.isFileExist(fileId);

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
