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
import { firstValueFrom } from 'rxjs';
import { IFoulderDTO } from './dto/foulder.dto';

@Controller('foulder')
export class FoulderController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @Post('add')
  async create(@Body() createFoulderDto: IFoulderDTO) {
    console.log(createFoulderDto);
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/add', createFoulderDto),
    );
    if (res.status === false) {
      throw new HttpException(res.message, res.httpCode);
    }
    return res;
  }

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
