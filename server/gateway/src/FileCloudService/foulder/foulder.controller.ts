import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpException,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpErrorDTO } from 'src/AuthService/ResponseDTO/httpError.dto';
import { IFoulderDTO } from './dto/foulder.dto';

@ApiBearerAuth()
@ApiTags('FileCloud microservice - Foulder controller')
@Controller('foulder')
export class FoulderController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create new foulder' })
  @ApiResponse({ status: 200, type: IFoulderDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Post('add')
  async create(@Body() createFoulderDto: IFoulderDTO) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/add', createFoulderDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get all foulders' })
  @ApiResponse({ status: 200, type: IFoulderDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getAll')
  async findAll() {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/getAll', ''),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Get foulder by id' })
  @ApiResponse({ status: 200, type: IFoulderDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('get/:id')
  async findOne(@Param('id') foulderId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/get', foulderId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Edit foulder data' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Put('edit')
  async update(@Body() updateFoulderDto: IFoulderDTO) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/edit', updateFoulderDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

  @ApiOperation({ summary: 'Delete foulder' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('delete/:id')
  async remove(@Param('id') foulderId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/delete', foulderId),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }
}
