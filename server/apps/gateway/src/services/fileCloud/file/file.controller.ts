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
  Inject,
  HttpException,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FilesUploadDataDTO } from '@/services/fileCloud/file/dto/filesUploadData.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import destinationStorage from '@/services/fileCloud/multer/destination.storage';
import filenameStorage from '@/services/fileCloud/multer/filename.storage';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { diskStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';
import { FileDTO } from '@/services/fileCloud/file/dto/file.dto';
import { FileEditDataDTO } from '@/services/fileCloud/file/dto/filesEditData.dto';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('FileCloud microservice - File controller')
@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Files upload data with `files` interceptor' })
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: true,
    description: 'return uploaded files id',
  })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Post('add')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destinationStorage,
        filename: filenameStorage,
      }),
    }),
  )
  @Post('add')
  async create(
    @Body()
    filesUploadDTO: FilesUploadDataDTO,
  ) {
    console.log('filesUploadDTO', filesUploadDTO);
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
  async findOne(@Param('id', ParseIntPipe) fileId: number) {
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
  @UsePipes(ValidationPipe)
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
    @Body() updateFileDto: FileEditDataDTO,
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
    console.log('files', filesData);
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
  async remove(@Param('id', ParseIntPipe) fileId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('file/delete', fileId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
