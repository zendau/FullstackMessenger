import { Controller, HttpStatus } from '@nestjs/common';
import { FileService } from './file.service';

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

  @MessagePattern('file/getAll')
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

  @MessagePattern('file/get')
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

  @MessagePattern('file/delete')
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

  @MessagePattern('file/edit')
  async messagesFileData(@Payload() editData: any) {
    const res = await this.fileService.update(editData).catch((err) => {
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
